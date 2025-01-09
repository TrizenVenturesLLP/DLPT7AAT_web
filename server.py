from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import cv2
import numpy as np
import os
import base64
from datetime import date
import xlwt
from xlwt import Workbook
import xlrd
from xlutils.copy import copy as xl_copy

app = Flask(__name__)
CORS(app)

# Initialize arrays for known face encodings and names
known_face_encodings = []
known_face_names = []

# Load face encodings from data folder
data_folder = "data"
for file in os.listdir(data_folder):
    if file.lower().endswith(('png', 'jpg', 'jpeg')):
        file_path = os.path.join(data_folder, file)
        try:
            image = face_recognition.load_image_file(file_path)
            face_encodings = face_recognition.face_encodings(image)
            if face_encodings:
                known_face_encodings.append(face_encodings[0])
                known_face_names.append(os.path.splitext(file)[0])
        except Exception as e:
            print(f"Error processing file {file}: {e}")

@app.route('/api/process-frame', methods=['POST'])
def process_frame():
    try:
        # Get the base64 image from the request
        data = request.json
        base64_image = data['frame'].split(',')[1]
        image_data = base64.b64decode(base64_image)
        
        # Convert to numpy array
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Convert BGR to RGB
        rgb_frame = frame[:, :, ::-1]
        
        # Find faces in the frame
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        
        face_names = []
        engagement_score = 100  # Default engagement score
        
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"
            
            if True in matches:
                best_match_index = np.argmin(face_recognition.face_distance(known_face_encodings, face_encoding))
                if matches[best_match_index]:
                    name = known_face_names[best_match_index]
                    
            face_names.append(name)
            
            # Simulate engagement detection (replace with actual ML model)
            engagement_score = np.random.randint(70, 100)
        
        return jsonify({
            'faces': face_names,
            'engagement': engagement_score
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/register', methods=['POST'])
def register_face():
    try:
        data = request.json
        base64_image = data['image'].split(',')[1]
        name = data['name']
        
        # Decode and save image
        image_data = base64.b64decode(base64_image)
        file_path = os.path.join(data_folder, f"{name}.jpg")
        
        with open(file_path, 'wb') as f:
            f.write(image_data)
            
        # Update face encodings
        image = face_recognition.load_image_file(file_path)
        face_encodings = face_recognition.face_encodings(image)
        
        if face_encodings:
            known_face_encodings.append(face_encodings[0])
            known_face_names.append(name)
            return jsonify({'message': 'Face registered successfully'})
        else:
            return jsonify({'error': 'No face detected in image'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)