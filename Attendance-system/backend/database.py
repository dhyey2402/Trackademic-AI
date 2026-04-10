"""
Engineer 2: Database Layer
SQLite-based persistent storage for attendance sessions, events, and logs.
Uses SQLAlchemy Core (no ORM) for simplicity and zero extra dependencies.
"""

import sqlite3
import os
import time
from datetime import datetime
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "attendance_v2.db")


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create all tables if they don't exist."""
    conn = get_conn()
    cur = conn.cursor()

    # Tracks overall attendance per session per student
    cur.execute("""
        CREATE TABLE IF NOT EXISTS attendance_records (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id  TEXT    NOT NULL,
            student_id  TEXT    NOT NULL,
            student_name TEXT   NOT NULL,
            first_seen  REAL    NOT NULL,   -- unix timestamp
            last_seen   REAL    NOT NULL,   -- unix timestamp
            status      TEXT    NOT NULL DEFAULT 'Present',  -- Present | Absent
            updated_at  REAL    NOT NULL
        )
    """)

    # Append-only event log for every status change
    cur.execute("""
        CREATE TABLE IF NOT EXISTS attendance_events (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id   TEXT    NOT NULL,
            student_id   TEXT    NOT NULL,
            student_name TEXT    NOT NULL,
            event_type   TEXT    NOT NULL,  -- DETECTED | ABSENT | RETURNED
            timestamp    REAL    NOT NULL
        )
    """)

    # Session registry
    cur.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            session_id  TEXT PRIMARY KEY,
            started_at  REAL NOT NULL,
            ended_at    REAL,
            label       TEXT
        )
    """)

    # Users table for auth
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            email    TEXT    UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()
    
    # Always try to seed the default admin
    seed_admin()
    print("DB: attendance.db initialized.")


def seed_admin():
    """Create default admin if not exists."""
    admin_email = "admin@TrackAdemic AI.ai"
    admin_pass = "admin123"
    
    conn = get_conn()
    cur = conn.cursor()
    user = cur.execute("SELECT id FROM users WHERE email=?", (admin_email,)).fetchone()
    
    if not user:
        hashed = pwd_context.hash(admin_pass)
        cur.execute("INSERT INTO users (email, hashed_password) VALUES (?, ?)", (admin_email, hashed))
        conn.commit()
        print(f"DB: Default admin created ({admin_email})")
    conn.close()


def verify_user(email, password):
    """Verify password against DB."""
    conn = get_conn()
    user = conn.execute("SELECT hashed_password FROM users WHERE email=?", (email,)).fetchone()
    conn.close()
    
    if user and pwd_context.verify(password, user["hashed_password"]):
        return True
    return False


# ──────────────────────────────────────────────────────────────
# Session helpers
# ──────────────────────────────────────────────────────────────

def create_session(label: str = None) -> str:
    session_id = datetime.now().strftime("SES-%Y%m%d-%H%M%S")
    conn = get_conn()
    conn.execute(
        "INSERT INTO sessions (session_id, started_at, label) VALUES (?, ?, ?)",
        (session_id, time.time(), label or f"Session {session_id}")
    )
    conn.commit()
    conn.close()
    return session_id


def close_session(session_id: str):
    conn = get_conn()
    conn.execute(
        "UPDATE sessions SET ended_at = ? WHERE session_id = ?",
        (time.time(), session_id)
    )
    conn.commit()
    conn.close()


# ──────────────────────────────────────────────────────────────
# Record helpers
# ──────────────────────────────────────────────────────────────

def upsert_student_seen(session_id: str, student_id: str, student_name: str, ts: float):
    """Insert or update the attendance record for a student in this session."""
    conn = get_conn()
    cur = conn.cursor()
    row = cur.execute(
        "SELECT id, status FROM attendance_records WHERE session_id=? AND student_id=?",
        (session_id, student_id)
    ).fetchone()

    if row is None:
        # First time we see them this session
        cur.execute(
            """INSERT INTO attendance_records
               (session_id, student_id, student_name, first_seen, last_seen, status, updated_at)
               VALUES (?, ?, ?, ?, ?, 'Present', ?)""",
            (session_id, student_id, student_name, ts, ts, ts)
        )
        _log_event(cur, session_id, student_id, student_name, "DETECTED", ts)
    else:
        prev_status = row["status"]
        cur.execute(
            """UPDATE attendance_records
               SET last_seen=?, status='Present', updated_at=?
               WHERE session_id=? AND student_id=?""",
            (ts, ts, session_id, student_id)
        )
        if prev_status == "Absent":
            # They came back
            _log_event(cur, session_id, student_id, student_name, "RETURNED", ts)

    conn.commit()
    conn.close()


def mark_student_absent(session_id: str, student_id: str, student_name: str, ts: float):
    """Mark student as Absent and log the event."""
    conn = get_conn()
    cur = conn.cursor()
    row = cur.execute(
        "SELECT status FROM attendance_records WHERE session_id=? AND student_id=?",
        (session_id, student_id)
    ).fetchone()

    if row and row["status"] == "Present":
        cur.execute(
            """UPDATE attendance_records
               SET status='Absent', updated_at=?
               WHERE session_id=? AND student_id=?""",
            (ts, session_id, student_id)
        )
        _log_event(cur, session_id, student_id, student_name, "ABSENT", ts)
        conn.commit()

    conn.close()


def _log_event(cur, session_id, student_id, student_name, event_type, ts):
    cur.execute(
        """INSERT INTO attendance_events
           (session_id, student_id, student_name, event_type, timestamp)
           VALUES (?, ?, ?, ?, ?)""",
        (session_id, student_id, student_name, event_type, ts)
    )


# ──────────────────────────────────────────────────────────────
# Query helpers (used by API endpoints)
# ──────────────────────────────────────────────────────────────

def get_session_report(session_id: str) -> list[dict]:
    conn = get_conn()
    rows = conn.execute(
        """SELECT student_name, status, first_seen, last_seen
           FROM attendance_records WHERE session_id=?
           ORDER BY student_name""",
        (session_id,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_session_events(session_id: str) -> list[dict]:
    conn = get_conn()
    rows = conn.execute(
        """SELECT student_name, event_type, timestamp
           FROM attendance_events WHERE session_id=?
           ORDER BY timestamp DESC LIMIT 100""",
        (session_id,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_all_sessions() -> list[dict]:
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM sessions ORDER BY started_at DESC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]
