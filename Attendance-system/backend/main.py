"""
main.py — TrackAdemic AI AI Backend (API-only mode)
Runs on port 8000 without requiring a camera or DeepFace.
Camera/CV features degrade gracefully when the camera is offline.
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta
import time

from database import init_db, verify_user
from state_engine import state_engine

app = FastAPI(title="TrackAdemic AI AI Backend", version="2.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "36hr-hackathon-super-secret"
ALGORITHM  = "HS256"

# ── Try importing the CV engine ──
try:
    from cv_engine import SmartVisionEngine
    # Using laptop webcam (0) instead of IP camera
    CAMERA_URL    = 0
    vision_engine = SmartVisionEngine(camera_source=CAMERA_URL)
    CV_AVAILABLE  = True
    print("[OK] CV Engine loaded (Webcam 0)")
except Exception as e:
    vision_engine = None
    CV_AVAILABLE  = False
    print(f"[WARN] CV Engine init failed ({e}) - running in API-only mode")


# ────────────────────────────────────────────────────────────
# Startup / Shutdown
# ────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup_event():
    # Always init DB (creates tables + seeds admin user)
    init_db()
    print("[OK] Database ready")

    # Start CV engine only if available
    if CV_AVAILABLE and vision_engine:
        try:
            vision_engine.start()
            print("[OK] Vision Engine started")
        except Exception as e:
            print(f"[WARN] Vision Engine failed to start: {e}")

    # Start state engine session
    session_id = state_engine.start_session(label="Live Classroom Session")
    print(f"[OK] StateEngine session started [{session_id}]")
    print("\nTrackAdemic AI API running on http://0.0.0.0:8000")
    print("   Docs: http://127.0.0.1:8000/docs")


@app.on_event("shutdown")
def shutdown_event():
    state_engine.stop_session()
    if CV_AVAILABLE and vision_engine:
        vision_engine.stop()


# ────────────────────────────────────────────────────────────
# Auth
# ────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
def login(data: LoginRequest):
    """Verify credentials and return a JWT session token."""
    if verify_user(data.email, data.password):
        expires = datetime.utcnow() + timedelta(days=7)
        token = jwt.encode(
            {"sub": data.email, "exp": expires},
            SECRET_KEY, algorithm=ALGORITHM
        )
        return {
            "token": token,
            "user": {"email": data.email, "role": "admin"}
        }
    raise HTTPException(status_code=401, detail="Invalid email or password")


# ────────────────────────────────────────────────────────────
# Camera / CV endpoints
# ────────────────────────────────────────────────────────────

@app.get("/stream")
def stream():
    """Live MJPEG stream with CV bounding boxes (requires camera)."""
    if not CV_AVAILABLE or vision_engine is None:
        raise HTTPException(503, "Camera / CV engine not available")
    return StreamingResponse(
        vision_engine.generate_video_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.get("/api/detections")
def get_detections():
    """Raw current-frame detections list."""
    if not CV_AVAILABLE or vision_engine is None:
        return {"active_students": []}
    return {"active_students": vision_engine.get_latest_detections()}


# ────────────────────────────────────────────────────────────
# Attendance / State Engine endpoints
# ────────────────────────────────────────────────────────────

@app.get("/live-data")
def live_data():
    """
    Primary frontend polling endpoint.
    Returns the current live snapshot from the State Engine.
    """
    return {"students": state_engine.get_live_snapshot()}


@app.get("/summary")
def summary():
    """
    Aggregated stats: total / present / absent / attendance_rate.
    Used by the Stats Cards on the dashboard.
    """
    return state_engine.get_summary()


@app.get("/report")
def report():
    """Full session attendance report from the database."""
    return {"report": state_engine.get_report()}


@app.get("/events")
def events():
    """Last 100 state-change events (DETECTED, ABSENT, RETURNED)."""
    return {"events": state_engine.get_events()}


@app.get("/session/status")
def get_session_status():
    """Returns the current active session ID and status."""
    sid = state_engine.session_id
    return {"active": sid is not None, "session_id": sid}


@app.post("/session/reset")
def reset_session(label: str = "New Classroom Session"):
    """Force-stop current session and start a new one."""
    new_id = state_engine.reset_session(label=label)
    return {"status": "success", "new_session_id": new_id}


@app.get("/health")
def health():
    """Health check — confirms backend is running."""
    return {
        "status": "ok",
        "cv_available": CV_AVAILABLE,
        "session_id": state_engine.session_id,
        "tracked_students": len(state_engine.get_live_snapshot()),
        "timestamp": datetime.utcnow().isoformat()
    }


# ────────────────────────────────────────────────────────────
# Entry point
# ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=False)
