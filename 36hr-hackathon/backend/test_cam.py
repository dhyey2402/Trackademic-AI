import cv2

def test_webcam():
    # 0 is usually the default ID for the laptop webcam
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open the webcam.")
        return

    print("Success! Webcam feed is opening. Press 'q' on your keyboard to close the window.")

    while True:
        # Capture frame-by-frame
        ret, frame = cap.read()
        
        if not ret:
            print("Error: Can't receive frame (stream end?). Exiting ...")
            break

        # Display the resulting frame
        cv2.imshow('Smart Classroom - Webcam Test', frame)

        # Wait for 'q' key to stop the program
        if cv2.waitKey(1) == ord('q'):
            break

    # When everything done, release the capture
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    test_webcam()
