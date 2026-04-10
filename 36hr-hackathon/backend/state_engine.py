"""
Engineer 2: State & Decision Engine
Sits between the CV engine (raw detections) and the API (clean state).
Responsibilities:
  - Maintains authoritative student state per session
  - Applies the 15-min absence rule
  - Persists all changes to the database
  - Exposes a clean snapshot for the API
"""

import threading
import time
from datetime import datetime
from database import (
    init_db,
    create_session,
    close_session,
    upsert_student_seen,
    mark_student_absent,
    get_session_report,
    get_session_events,
)

# ──────────────────────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────────────────────
ABSENCE_TIMEOUT_SECONDS = 15 * 60   # 15 minutes → mark Absent
SWEEP_INTERVAL_SECONDS  = 30        # How often the absence sweep runs


class StateEngine:
    """
    Singleton-style decision engine.
    Should be created once at application startup and kept alive.
    """

    def __init__(self):
        init_db()
        self._lock = threading.Lock()

        # In-memory state: { student_id -> StudentState dict }
        self._state: dict[str, dict] = {}
        self._session_id: str | None = None
        self._running = False
        self._sweep_thread: threading.Thread | None = None
        
        # Auto-start a default monitoring session on boot
        # Without this, detections are passively dropped from DB event logs
        self.start_session(label="Auto Monitoring Session")

    # ──────────────────────────────────────────────────────────
    # Session lifecycle
    # ──────────────────────────────────────────────────────────

    def start_session(self, label: str = None) -> str:
        with self._lock:
            if self._session_id:
                return self._session_id  # already running
            self._session_id = create_session(label)
            self._state.clear()
            self._running = True
            if self._sweep_thread is None or not self._sweep_thread.is_alive():
                self._sweep_thread = threading.Thread(
                    target=self._absence_sweep_loop, daemon=True
                )
                self._sweep_thread.start()
            print(f"StateEngine: Session started [{self._session_id}]")
            return self._session_id

    def reset_session(self, label: str = None) -> str:
        """Stops the current session and instantly starts a new one."""
        self.stop_session()
        return self.start_session(label)

    def stop_session(self):
        with self._lock:
            if not self._session_id:
                return
            close_session(self._session_id)
            print(f"StateEngine: Session closed [{self._session_id}]")
            self._session_id = None
            self._running = False # This will cause the sweep loop to exit eventually

    @property
    def session_id(self) -> str | None:
        return self._session_id

    # ──────────────────────────────────────────────────────────
    # Called by CV Engine on every recognised detection
    # ──────────────────────────────────────────────────────────

    def report_detection(self, student_id: str, student_name: str,
                          box: tuple, confidence: float = 1.0):
        """
        Called every time the CV pipeline confirms a student in a frame.
        Thread-safe. Fast path — no DB I/O on the hot path.
        """
        now = time.time()
        with self._lock:
            if not self._session_id:
                return

            existing = self._state.get(student_id)
            if existing is None:
                self._state[student_id] = {
                    "student_id":   student_id,
                    "name":         student_name,
                    "status":       "Present",
                    "first_seen":   now,
                    "last_seen":    now,
                    "box":          box,
                    "confidence":   confidence,
                    "_db_written":  False,
                }
            else:
                prev_status = existing["status"]
                existing["last_seen"]  = now
                existing["status"]     = "Present"
                existing["box"]        = box
                existing["confidence"] = confidence
                # If they returned from Absent push to DB immediately
                if prev_status == "Absent":
                    existing["_db_written"] = False

        # DB write outside the main lock to avoid blocking the CV thread
        self._flush_student(student_id, now)

    def _flush_student(self, student_id: str, ts: float):
        """Persist a student's latest seen record to DB."""
        with self._lock:
            s = self._state.get(student_id)
            if s is None:
                return
            sid  = self._session_id
            name = s["name"]

        upsert_student_seen(sid, student_id, name, ts)

        with self._lock:
            if student_id in self._state:
                self._state[student_id]["_db_written"] = True

    # ──────────────────────────────────────────────────────────
    # Background absence sweep — runs every SWEEP_INTERVAL_SECONDS
    # ──────────────────────────────────────────────────────────

    def _absence_sweep_loop(self):
        while self._running:
            time.sleep(SWEEP_INTERVAL_SECONDS)
            if not self._running:
                break
            self._sweep_absences()

    def _sweep_absences(self):
        now = time.time()
        to_mark_absent = []

        with self._lock:
            if not self._session_id:
                return
            for sid, s in self._state.items():
                if s["status"] == "Present":
                    gap = now - s["last_seen"]
                    if gap > ABSENCE_TIMEOUT_SECONDS:
                        s["status"] = "Absent"
                        to_mark_absent.append((sid, s["name"]))

        # DB writes outside lock
        for student_id, name in to_mark_absent:
            mark_student_absent(self._session_id, student_id, name, now)
            print(f"StateEngine: {name} marked Absent (timeout)")

    # ──────────────────────────────────────────────────────────
    # Public read API (called by FastAPI endpoints)
    # ──────────────────────────────────────────────────────────

    def get_live_snapshot(self) -> list[dict]:
        """
        Returns the current in-memory state.
        This is what '/live-data' returns — no DB hit, sub-millisecond.
        """
        with self._lock:
            return [
                {
                    "name":       s["name"],
                    "status":     s["status"],
                    "last_seen":  s["last_seen"],
                    "first_seen": s["first_seen"],
                    "box":        list(s["box"]) if s.get("box") else None,
                }
                for s in self._state.values()
            ]

    def get_report(self) -> list[dict]:
        """Full session report from DB (accurate, includes all students ever seen)."""
        if not self._session_id:
            return []
        return get_session_report(self._session_id)

    def get_events(self) -> list[dict]:
        """Returns the last 100 events from DB with human-readable timestamps."""
        if not self._session_id:
            return []
        raw = get_session_events(self._session_id)
        for e in raw:
            e["time"] = datetime.fromtimestamp(e["timestamp"]).strftime("%H:%M:%S")
        return raw

    def get_summary(self) -> dict:
        """Quick stats for the dashboard stats cards."""
        snapshot = self.get_live_snapshot()
        present = sum(1 for s in snapshot if s["status"] == "Present")
        absent  = sum(1 for s in snapshot if s["status"] == "Absent")
        total   = len(snapshot)
        rate    = round((present / total * 100), 1) if total else 0.0
        return {
            "session_id":       self._session_id,
            "total":            total,
            "present":          present,
            "absent":           absent,
            "attendance_rate":  rate,
        }


# ──────────────────────────────────────────────────────────────
# Global singleton — imported by cv_api.py
# ──────────────────────────────────────────────────────────────
state_engine = StateEngine()
