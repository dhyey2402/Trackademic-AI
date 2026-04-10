"""
Live Enrollment: Captures a face directly from the webcam for enrollment.
This produces much better embeddings for webcam recognition because
the lighting/angle/camera characteristics match exactly.
"""
import sys
import cv2
import pickle
import os
import numpy as np
from deepface import DeepFace

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "registered_faces.pkl")

MODEL_NAME = "Facenet"
DETECTOR_BACKEND = "opencv"


def enroll_from_webcam(student_id, student_name, num_captures=5, camera_source=0):
    """
    Captures multiple frames from the webcam, generates embeddings for each,
    and stores the AVERAGE embedding. This is much more robust than a single photo.
    """
    cap = cv2.VideoCapture(camera_source)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    print(f"\n📸 Enrolling '{student_name}' (ID: {student_id})")
    print(f"   Will capture {num_captures} samples. Look at the camera and press SPACE to capture.")
    print(f"   Try slightly different angles/expressions for each capture.\n")

    embeddings = []
    capture_count = 0

    while capture_count < num_captures:
        ret, frame = cap.read()
        if not ret:
            break

        # Show live preview with instructions
        display = frame.copy()
        cv2.putText(display, f"Captures: {capture_count}/{num_captures} - Press SPACE to capture, Q to finish",
                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

        # Try to detect and show face box in real-time
        try:
            results = DeepFace.represent(
                img_path=frame,
                model_name=MODEL_NAME,
                detector_backend=DETECTOR_BACKEND,
                enforce_detection=False
            )
            for res in results:
                fa = res.get("facial_area", {})
                conf = res.get("face_confidence", 0)
                frame_h, frame_w = frame.shape[:2]
                fw, fh = fa.get("w", 0), fa.get("h", 0)
                if conf > 0.5 and not (fw > frame_w * 0.9 and fh > frame_h * 0.9):
                    x, y, w, h = fa["x"], fa["y"], fa["w"], fa["h"]
                    cv2.rectangle(display, (x, y), (x + w, y + h), (0, 255, 0), 2)
                    cv2.putText(display, f"Conf: {conf:.2f}", (x, y - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
        except:
            pass

        cv2.imshow("Enrollment - Press SPACE to capture", display)
        key = cv2.waitKey(1)

        if key == ord(' '):
            # Capture this frame
            try:
                results = DeepFace.represent(
                    img_path=frame,
                    model_name=MODEL_NAME,
                    detector_backend=DETECTOR_BACKEND,
                    enforce_detection=False
                )
                # Filter: skip full-frame fallback results (no real face found)
                frame_h, frame_w = frame.shape[:2]
                valid = [r for r in results
                         if r.get("face_confidence", 0) > 0.5
                         and not (r["facial_area"]["w"] > frame_w * 0.9
                                  and r["facial_area"]["h"] > frame_h * 0.9)]
                if valid:
                    embedding = valid[0]["embedding"]
                    embeddings.append(embedding)
                    capture_count += 1
                    print(f"   ✅ Capture {capture_count}/{num_captures} successful!")
                else:
                    print("   ❌ No face detected in this frame. Try again.")
            except Exception as e:
                print(f"   ❌ Error: {e}")

        elif key == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    if not embeddings:
        print("❌ No faces captured. Enrollment failed.")
        return

    print(f"\n📊 Captured {len(embeddings)} high-quality encodings for cross-matching.")

    # Save to database
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'rb') as f:
            face_db = pickle.load(f)
    else:
        face_db = {}

    face_db[student_id] = {
        "name": student_name,
        "encodings": embeddings  # Store ALL embeddings to prevent averaging failure
    }

    with open(DB_FILE, 'wb') as f:
        pickle.dump(face_db, f)

    print(f"✅ Successfully enrolled {student_name} (ID: {student_id})!")


if __name__ == "__main__":
    student_id = input("Enter Student ID: ").strip()
    student_name = input("Enter Student Name: ").strip()
    
    source = input("\nEnter camera IP URL (e.g. http://192.168.1.x:8080/video) or press Enter to use laptop webcam: ").strip()
    camera_source = source if source else 0
    
    enroll_from_webcam(student_id, student_name, camera_source=camera_source)
