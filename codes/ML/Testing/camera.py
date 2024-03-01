import cv2
import tensorflow as tf
import numpy as np

# Load the trained model
model = tf.keras.models.load_model('C:/Users/User/Desktop/Document/UWE/FYP/fyp/codes/ML/Recognition/Model/FER_v3.h5')



# Initialize the webcam
cap = cv2.VideoCapture(0)

# Define the list of emotions
emotions = ["Angry", "Happy", "Sad", "Neutral"]

# Load the Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Convert the frame to grayscale
    grayscale_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the frame
    faces = face_cascade.detectMultiScale(grayscale_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    for (x, y, w, h) in faces:
        # Draw rectangle around the face
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

        # Extract the face ROI
        face_roi = grayscale_frame[y:y+h, x:x+w]

        # Preprocess the face ROI
        processed_face = cv2.resize(face_roi, (48, 48))
        model_input = processed_face.reshape((1, 48, 48, 1)) / 255.0

        # Predict the emotion
        prediction = model.predict(model_input)
        print(prediction)
        max_index = np.argmax(prediction[0])
        emotion = emotions[max_index]

        # Display the emotion
        cv2.putText(frame, emotion, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    # Display the result
    cv2.imshow('Frame', frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
