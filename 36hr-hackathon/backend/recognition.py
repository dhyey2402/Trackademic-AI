import sys
import cv2
import pickle
import os
import numpy as np
from deepface import DeepFace

# Fix Windows terminal encoding for emoji/unicode output
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "registered_faces.pkl")

# Facenet handles unaligned webcam faces MUCH better than VGG-Face
MODEL_NAME = "Facenet"
DETECTOR_BACKEND = "opencv" # Realtime speed
METRIC = "cosine"
TOLERANCE = 0.40 # Facenet threshold is strict and highly discriminative

if not os.path.exists(DB_FILE):
    print("❌ Error: Database not found! Please run 'enrollment.py' first.")
    exit()

with open(DB_FILE, 'rb') as f:
    face_db = pickle.load(f)

def find_match(live_embedding):
    best_match_id = None
    min_dist = float("inf")

    live_dim = len(live_embedding)
    for student_id, data in face_db.items():
        stored_encodings = data.get("encodings", [])
        if not stored_encodings:
            # Fallback for old single 'encoding'
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
                
        print(f"  ↳ vs ID {student_id} ({data['name']}): Best Distance = {student_min_dist:.4f}")

        if student_min_dist < TOLERANCE and student_min_dist < min_dist:
            min_dist = student_min_dist
            best_match_id = student_id

    return best_match_id

def start_recognition(camera_source=0):
    cap = cv2.VideoCapture(camera_source)
    # Higher resolution gives the detector much better range
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    frame_count = 0
    process_every_n_frames = 5
    current_faces = []

    print(f"\n⏳ Warming up {MODEL_NAME} model...")
    # Warm up to load model weights on first run
    try:
        DeepFace.represent(
            img_path=np.zeros((224, 224, 3), dtype=np.uint8),
            model_name=MODEL_NAME,
            detector_backend="skip",
            enforce_detection=False
        )
    except:
        pass
    print("✅ System Ready! Press 'q' to quit.\n")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % process_every_n_frames == 0:
            current_faces = []
            
            # Let DeepFace handle BOTH detection and embedding extraction.
            # enforce_detection=False means it won't crash when no face is visible,
            # and we filter by face_confidence ourselves.
            results = DeepFace.represent(
                img_path=frame,
                model_name=MODEL_NAME,
                detector_backend=DETECTOR_BACKEND,
                enforce_detection=False
            )

            # Filter out non-face detections (low confidence or full-frame fallback)
            frame_h, frame_w = frame.shape[:2]
            valid_faces = []
            for res in results:
                fa = res.get("facial_area", {})
                conf = res.get("face_confidence", 0)
                fw, fh = fa.get("w", 0), fa.get("h", 0)
                # Skip if confidence too low or if DeepFace returned the whole frame as "face"
                if conf < 0.5 or (fw > frame_w * 0.9 and fh > frame_h * 0.9):
                    continue
                valid_faces.append(res)

            print(f"[Frame {frame_count}] Detected {len(valid_faces)} face(s).")

            for res in valid_faces:
                embedding = res["embedding"]
                facial_area = res["facial_area"]
                x, y, w, h = facial_area["x"], facial_area["y"], facial_area["w"], facial_area["h"]

                match_id = find_match(embedding)

                if match_id:
                    label = face_db[match_id]["name"]
                    color = (0, 255, 0)  # Green
                else:
                    label = "Unknown"
                    color = (0, 0, 255)  # Red

                current_faces.append({
                    "box": (x, y, w, h),
                    "label": label,
                    "color": color
                })

        # Draw boxes on every frame
        for face in current_faces:
            x, y, w, h = face["box"]
            cv2.rectangle(frame, (x, y), (x + w, y + h), face["color"], 2)
            cv2.putText(frame, face["label"], (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, face["color"], 2)

        cv2.imshow('Smart Classroom - Real-Time Recognition', frame)
        frame_count += 1

        if cv2.waitKey(1) == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    source = input("Enter camera IP URL (e.g. http://192.168.1.x:8080/video) or press Enter to use laptop webcam: ").strip()
    camera_source = source if source else 0
    start_recognition(camera_source)
