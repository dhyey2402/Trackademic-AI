from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta
from cv_engine import SmartVisionEngine
from state_engine import state_engine
from database import verify_user

app = FastAPI(title="TrackAdemic AI AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize CV Engine globally
camera_url = "http://192.168.137.233:8080/video"
vision_engine = SmartVisionEngine(camera_source=camera_url)
# Logic Configuration
SECRET_KEY = "36hr-hackathon-super-secret"
ALGORITHM = "HS256"

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
def login(data: LoginRequest):
    """Verify credentials and return a session token."""
    if verify_user(data.email, data.password):
        # Create token
        expires = datetime.utcnow() + timedelta(days=7) # Remember me logic
        token = jwt.encode({"sub": data.email, "exp": expires}, SECRET_KEY, algorithm=ALGORITHM)
        return {
            "token": token,
            "user": {
                "email": data.email,
                "role": "admin"
            }
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")


@app.on_event("startup")
def startup_event():
    print("Starting Vision Engine...")
    vision_engine.start()
    # Engineer 2: start the state engine session
    session_id = state_engine.start_session(label="Live Classroom Session")
    print(f"StateEngine: session started [{session_id}]")


@app.on_event("shutdown")
def shutdown_event():
    state_engine.stop_session()
    vision_engine.stop()


# ─────────────────────────────────────────────
# Engineer 1 / 3 existing endpoints
# ─────────────────────────────────────────────

@app.get("/stream")
def stream():
    """Live MJPEG stream with CV bounding boxes."""
    return StreamingResponse(
        vision_engine.generate_video_stream(),
        media_type='multipart/x-mixed-replace; boundary=frame'
    )


@app.get("/api/detections")
def get_detections():
    """Raw current-frame detections list."""
    return {"active_students": vision_engine.get_latest_detections()}


# ─────────────────────────────────────────────
# Engineer 2 + 3 integrated endpoints
# ─────────────────────────────────────────────

@app.get("/live-data")
def live_data():
    """
    Primary frontend polling endpoint.
    Returns authoritative live state from the State Engine.
    """
    return {"students": state_engine.get_live_snapshot()}


@app.get("/summary")
def summary():
    """
    Aggregated stats: total / present / absent / attendance rate.
    Used by the StatsCards component.
    """
    return state_engine.get_summary()


@app.get("/report")
def report():
    """
    Full session attendance report from DB.
    Includes all students ever seen, even if not currently in frame.
    """
    return {"report": state_engine.get_report()}


@app.get("/events")
def events():
    """
    Last 100 state-change events (DETECTED, ABSENT, RETURNED) from DB.
    Used by the Alerts page.
    """
    return {"events": state_engine.get_events()}


@app.get("/session/status")
def get_session_status():
    """Returns the current active session ID and status."""
    sid = state_engine.session_id
    return {
        "active": sid is not None,
        "session_id": sid
    }


@app.post("/session/reset")
def reset_session(label: str = "New Classroom Session"):
    """Force stops the current session and starts a new one."""
    new_id = state_engine.reset_session(label=label)
    return {"status": "success", "new_session_id": new_id}


@app.get("/health")
def health():
    """Health check — confirms backend + state engine are running."""
    return {
        "status": "ok",
        "session_id": state_engine.session_id,
        "tracked_students": len(state_engine.get_live_snapshot()),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("cv_api:app", host="0.0.0.0", port=8000, reload=True)
