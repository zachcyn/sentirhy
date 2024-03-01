import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, min_detection_confidence=0.5)

def get_facial_landmarks(image):
    # Convert the image color from BGR to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Process the image and get the face landmarks
    results = face_mesh.process(image_rgb)

    if results.multi_face_landmarks:
        # Extract the facial landmarks
        landmarks = results.multi_face_landmarks[0]
        return [(landmark.x, landmark.y, landmark.z) for landmark in landmarks.landmark]
    else:
        return None

def draw_landmarks(frame, landmarks):
    if landmarks is not None:
        for x, y, _ in landmarks:
            x, y = int(x * frame.shape[1]), int(y * frame.shape[0])
            cv2.circle(frame, (x, y), 1, (0, 255, 0), -1)  # Green dot for each landmark
    return frame

def landmarks_to_spatial_representation(landmarks, image_size=(48, 48)):
    spatial_repr = np.zeros((image_size[0], image_size[1], 3), dtype=np.float32)  # Initialize an empty image
    
    for x, y, z in landmarks:
        x_norm = int(x * (image_size[0] - 1))
        y_norm = int(y * (image_size[1] - 1))

        # Assuming the first channel is for presence, and others for x and y coordinates
        spatial_repr[y_norm, x_norm, :] = [1, x, y]  # Adjust this based on how your model was trained

    flattened_spatial_repr = spatial_repr.reshape(-1)

    return spatial_repr

def flatten_landmarks(landmarks):
    scaler = StandardScaler()
    if landmarks:
        # Flatten the landmarks
        flattened = np.array(landmarks).flatten()
        flattened_2d = flattened.reshape(1, -1)
        scaled = scaler.fit_transform(flattened_2d)
        scaled_1d = scaled.flatten()
        return scaled_1d
    else:
        return None

def draw_emotion_label(frame, emotion_prediction):
    # Assuming emotion_prediction is an array of probabilities, get the index of the max probability
    emotion_index = np.argmax(emotion_prediction[0])
    
    # Convert the index to a readable label (update this based on your model's labels)
    emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
    emotion_label = emotion_labels[emotion_index]

    # Draw the emotion label on the frame
    cv2.putText(frame, emotion_label, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)
    return frame

model = tf.keras.models.load_model('./codes/ML/Recognition/Model/FER_w_CK+_LM_v1.keras')

# Start capturing video
cap = cv2.VideoCapture(0)

emotion_prediction = ''

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Detect facial landmarks
    landmarks = get_facial_landmarks(frame)  # Adjust parameters as needed

    if landmarks:
        flattened_landmarks = flatten_landmarks(landmarks)
        # landmarks_array = np.array(landmarks)
        # processed_landmarks = landmarks_to_spatial_representation(landmarks_array)
        emotion_prediction = model.predict(np.array([flattened_landmarks]))
        print(emotion_prediction)
        # Optionally, process the prediction to display it (e.g., convert to a label)

    # Draw landmarks and emotion label on the frame
    frame_with_landmarks = draw_landmarks(frame, landmarks)
    frame_with_label = draw_emotion_label(frame_with_landmarks, emotion_prediction)

    # Display the frame
    cv2.imshow('Real-time Emotion Recognition', frame_with_label)

    if cv2.waitKey(1) & 0xFF == 27:  # Press 'Esc' to exit
        break

cap.release()
cv2.destroyAllWindows()