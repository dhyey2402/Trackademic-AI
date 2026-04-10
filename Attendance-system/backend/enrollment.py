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

MODEL_NAME = "VGG-Face"
DETECTOR_BACKEND = "opencv"

def enroll_student(image_path, student_id, student_name):
    print(f"Opening {image_path} to trace face...")

    if not os.path.exists(image_path):
        print(f"❌ Error: Could not find image at '{image_path}'.")
        return

    print(f"⏳ Generating embedding using {MODEL_NAME} with {DETECTOR_BACKEND} detector...")
    try:
        results = DeepFace.represent(
            img_path=image_path,
            model_name=MODEL_NAME,
            detector_backend=DETECTOR_BACKEND,
            enforce_detection=True
        )
    except ValueError:
        print("❌ Error: Could not detect a face in the image.")
        print("   Make sure the photo has a clear, well-lit front-facing face.")
        return
    except Exception as e:
        print(f"❌ Error generating embedding: {e}")
        return

    if not results:
        print("❌ Error: DeepFace returned empty results.")
        return

    # Use the largest face found if multiple are present
    best_face = max(results, key=lambda res: res['facial_area']['w'] * res['facial_area']['h'])
    embedding = best_face["embedding"]
    conf = best_face.get("face_confidence", 1.0)
    
    print(f"✅ Face detected (confidence: {conf:.2f}). Generating accurate aligned embedding...")

    # Load existing database (or create new one)
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'rb') as f:
            face_db = pickle.load(f)
    else:
        face_db = {}

    face_db[student_id] = {
        "name": student_name,
        "encoding": embedding
    }

    with open(DB_FILE, 'wb') as f:
        pickle.dump(face_db, f)

    print(f"✅ Successfully enrolled {student_name} (ID: {student_id}) into the local database!")

if __name__ == "__main__":
    test_image = os.path.join(BASE_DIR, "my_photo.jpg")

    if not os.path.exists(test_image):
        print(f"❌ Error: Could not find '{test_image}'.")
    else:
        enroll_student(test_image, student_id="102", student_name="Dhyey")