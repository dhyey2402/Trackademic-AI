import os
import cv2
import pickle
import numpy as np
try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except ImportError:
    DEEPFACE_AVAILABLE = False
import time
import threading
from state_engine import state_engine

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "registered_faces.pkl")

# Configuration optimized for live webcam streams
MODEL_NAME = "Facenet"
DETECTOR_BACKEND = "opencv"
METRIC = "cosine"
TOLERANCE = 0.24          # Ultra-strict threshold to firmly reject false-positives
PROCESS_EVERY_N_FRAMES = 5

class SmartVisionEngine:
    def __init__(self, camera_source=0):
        self.camera_source = camera_source
        self.face_db = self._load_db()
        self.cap = None
        self.lock = threading.Lock()
        
        # State tracking for cross-module reading
        self.latest_frame = None
        self.latest_detections = []
        self.is_running = False

    def _load_db(self):
        if not os.path.exists(DB_FILE):
            print("Warning: registered_faces.pkl not found. Engine will not recognize anyone.")
            return {}
        with open(DB_FILE, 'rb') as f:
            return pickle.load(f)

    def _find_match(self, live_embedding):
        best_match_id = None
        min_dist = float("inf")
        live_dim = len(live_embedding)

        for student_id, data in self.face_db.items():
            stored_encodings = data.get("encodings", [])
            if not stored_encodings:
                stored_encodings = [data.get("encoding", [])]
                
            student_min_dist = float("inf")
            for stored_encoding in stored_encodings:
                stored_encoding = np.array(stored_encoding)
                if stored_encoding.shape[0] != live_dim:
                    continue
                    
                dot_product = np.dot(live_embedding, stored_encoding)
                norm_live = np.linalg.norm(live_embedding)
                norm_stored = np.linalg.norm(stored_encoding)
                cosine_dist = 1 - (dot_product / (norm_live * norm_stored))
                
                if cosine_dist < student_min_dist:
                    student_min_dist = cosine_dist

            if student_min_dist < TOLERANCE and student_min_dist < min_dist:
                min_dist = student_min_dist
                best_match_id = student_id

        return best_match_id

    def start(self):
        """Starts the camera feed processing pipeline in a background thread."""
        self.cap = cv2.VideoCapture(self.camera_source)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        
        if DEEPFACE_AVAILABLE:
            print("\nWarming up VisioEngine (Facenet)...")
            try:
                DeepFace.represent(np.zeros((224, 224, 3), dtype=np.uint8), model_name=MODEL_NAME, detector_backend="skip", enforce_detection=False)
            except:
                pass
        else:
            print("\n[WARN] VisioEngine running in RAW WebCam mode (DeepFace not installed). No AI recognition will occur.")
        
        self.is_running = True
        # Start background processing thread
        thread = threading.Thread(target=self._process_feed, daemon=True)
        thread.start()
        print("Engine Processing thread started successfully.")

    def stop(self):
        """Stops the camera feed."""
        self.is_running = False
        if self.cap:
            self.cap.release()

    def _process_feed(self):
        frame_count = 0
        current_faces = []

        while self.is_running and self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                time.sleep(0.01)
                continue

            frame_count += 1

            if DEEPFACE_AVAILABLE and frame_count % PROCESS_EVERY_N_FRAMES == 0:
                results = DeepFace.represent(frame, model_name=MODEL_NAME, detector_backend=DETECTOR_BACKEND, enforce_detection=False)
                
                frame_h, frame_w = frame.shape[:2]
                valid_faces = []
                # Clean up full-frame false-positives
                for res in results:
                    fa = res.get("facial_area", {})
                    conf = res.get("face_confidence", 0)
                    fw, fh = fa.get("w", 0), fa.get("h", 0)
                    # Raise confidence gate to 0.75 to reject blurry/background blobs
                    if conf < 0.75 or (fw > frame_w * 0.9 and fh > frame_h * 0.9):
                        continue
                    # Also reject tiny detections (likely noise)
                    if fw < 40 or fh < 40:
                        continue
                    valid_faces.append(res)

                # Process valid faces
                new_detections = []
                active_identities = []
                for res in valid_faces:
                    x, y, w, h = res["facial_area"]["x"], res["facial_area"]["y"], res["facial_area"]["w"], res["facial_area"]["h"]
                    match_id = self._find_match(res["embedding"])

                    current_time = time.time()
                    if match_id:
                        name = self.face_db[match_id]["name"]
                        color = (0, 255, 0)
                        active_identities.append({"student_id": match_id, "name": name, "timestamp": current_time, "box": (x, y, w, h)})
                    else:
                        name = "Unknown"
                        color = (0, 0, 255)

                    new_detections.append({
                        "box": (x, y, w, h),
                        "label": name,
                        "color": color
                    })

                # Thread-safe update
                with self.lock:
                    current_faces = new_detections
                    self.latest_detections = active_identities

                # Report each confirmed match to the State Engine
                for student in active_identities:
                    state_engine.report_detection(
                        student_id=student["student_id"],
                        student_name=student["name"],
                        box=student["box"],
                    )

            # Draw visual markers directly onto the frame for streaming
            display_frame = frame.copy()
            for face in current_faces:
                x, y, w, h = face["box"]
                cv2.rectangle(display_frame, (x, y), (x + w, y + h), face["color"], 2)
                cv2.putText(display_frame, face["label"], (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, face["color"], 2)

            with self.lock:
                self.latest_frame = display_frame

    # ======= PUBLIC API FOR TEAM MEMBERS =======
    
    def get_latest_detections(self):
        """
        FOR ENGINEER 2 (State Engine): 
        Returns a list of currently detected student dictionaries in real-time.
        """
        with self.lock:
            return self.latest_detections.copy()

    def get_all_students(self):
        """
        Delegates to StateEngine — returns the authoritative live snapshot.
        """
        return state_engine.get_live_snapshot()

    def generate_video_stream(self):
        """
        FOR ENGINEER 3 (Frontend UI): 
        Yields JPEG byte structures representing the live camera feed with bounding boxes.
        Compatible with Flask 'Response' for Server-Sent Events.
        """
        while self.is_running:
            with self.lock:
                frame = self.latest_frame
            
            if frame is None:
                time.sleep(0.05)
                continue
                
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            time.sleep(0.03) # Cap at ~30 FPS stream rate to save bandwidth
