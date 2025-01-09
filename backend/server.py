# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# import face_recognition
# import cv2
# import numpy as np
# import os
# import base64
# from datetime import date
# import xlwt
# from xlwt import Workbook
# import xlrd
# from xlutils.copy import copy as xl_copy
# from gaze_tracking import GazeTracking

# app = Flask(__name__)
# CORS(app)

# # Initialize gaze tracking
# gaze = GazeTracking()

# # Initialize arrays for known face encodings and names
# known_face_encodings = []
# known_face_names = []

# # Load face encodings from data folder
# data_folder = "data"
# for file in os.listdir(data_folder):
#     if file.lower().endswith(('png', 'jpg', 'jpeg')):
#         file_path = os.path.join(data_folder, file)
#         try:
#             image = face_recognition.load_image_file(file_path)
#             face_encodings = face_recognition.face_encodings(image)
#             if face_encodings:
#                 known_face_encodings.append(face_encodings[0])
#                 known_face_names.append(os.path.splitext(file)[0])
#         except Exception as e:
#             print(f"Error processing file {file}: {e}")

# @app.route('/api/process-frame', methods=['POST'])
# def process_frame():
#     try:
#         # Get the base64 image from the request
#         data = request.json
#         base64_image = data['frame'].split(',')[1]
#         image_data = base64.b64decode(base64_image)
        
#         # Convert to numpy array
#         nparr = np.frombuffer(image_data, np.uint8)
#         frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
#         # Convert BGR to RGB
#         rgb_frame = frame[:, :, ::-1]
        
#         # Process gaze tracking
#         gaze.refresh(frame)
#         engagement_score = 100  # Default engagement score
        
#         # Determine engagement based on gaze
#         if gaze.is_blinking():
#             engagement_score -= 30  # Reduce score for blinking
#         elif gaze.is_right() or gaze.is_left():
#             engagement_score -= 20  # Reduce score for looking away
        
#         # Find faces in the frame
#         face_locations = face_recognition.face_locations(rgb_frame)
#         face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        
#         face_names = []
        
#         for face_encoding in face_encodings:
#             matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
#             name = "Unknown"
            
#             if True in matches:
#                 best_match_index = np.argmin(face_recognition.face_distance(known_face_encodings, face_encoding))
#                 if matches[best_match_index]:
#                     name = known_face_names[best_match_index]
                    
#             face_names.append(name)
            
#             # Update attendance in Excel
#             if name != "Unknown":
#                 update_attendance(name, engagement_score)
        
#         return jsonify({
#             'faces': face_names,
#             'engagement': engagement_score,
#             'gaze_status': gaze.get_gaze_status()
#         })
        
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# def update_attendance(name, engagement):
#     try:
#         today = date.today().strftime("%Y-%m-%d")
#         filename = "attendance.xls"
        
#         if not os.path.exists(filename):
#             wb = Workbook()
#             sheet = wb.add_sheet('Attendance')
#             sheet.write(0, 0, 'Date')
#             sheet.write(0, 1, 'Name')
#             sheet.write(0, 2, 'Status')
#             sheet.write(0, 3, 'Engagement')
#             wb.save(filename)
        
#         rb = xlrd.open_workbook(filename, formatting_info=True)
#         wb = xl_copy(rb)
#         sheet = wb.get_sheet(0)
        
#         row = rb.sheet_by_index(0).nrows
#         sheet.write(row, 0, today)
#         sheet.write(row, 1, name)
#         sheet.write(row, 2, 'Present')
#         sheet.write(row, 3, engagement)
        
#         wb.save(filename)
        
#     except Exception as e:
#         print(f"Error updating attendance: {e}")

# @app.route('/api/download-attendance', methods=['GET'])
# def download_attendance():
#     try:
#         return send_file(
#             'attendance.xls',
#             mimetype='application/vnd.ms-excel',
#             as_attachment=True,
#             download_name=f'attendance_{date.today().strftime("%Y-%m-%d")}.xls'
#         )
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/register', methods=['POST'])
# def register_face():
#     try:
#         data = request.json
#         base64_image = data['image'].split(',')[1]
#         name = data['name']
        
#         # Decode and save image
#         image_data = base64.b64decode(base64_image)
#         file_path = os.path.join(data_folder, f"{name}.jpg")
        
#         with open(file_path, 'wb') as f:
#             f.write(image_data)
            
#         # Update face encodings
#         image = face_recognition.load_image_file(file_path)
#         face_encodings = face_recognition.face_encodings(image)
        
#         if face_encodings:
#             known_face_encodings.append(face_encodings[0])
#             known_face_names.append(name)
#             return jsonify({'message': 'Face registered successfully'})
#         else:
#             return jsonify({'error': 'No face detected in image'}), 400
            
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

from flask import Flask, request, jsonify, send_file
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
from gaze_tracking import GazeTracking

app = Flask(__name__)
CORS(app)

# Initialize gaze tracking
gaze = GazeTracking()

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
        
        # Process gaze tracking
        gaze.refresh(frame)
        engagement_score = 100  # Default engagement score
        
        # Determine engagement based on gaze
        if gaze.is_blinking():
            engagement_score -= 30  # Reduce score for blinking
        elif gaze.is_right() or gaze.is_left():
            engagement_score -= 20  # Reduce score for looking away
        
        # Find faces in the frame
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        
        face_names = []
        
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"
            
            if True in matches:
                best_match_index = np.argmin(face_recognition.face_distance(known_face_encodings, face_encoding))
                if matches[best_match_index]:
                    name = known_face_names[best_match_index]
                    
            face_names.append(name)
            
            # Update attendance in Excel
            if name != "Unknown":
                update_attendance(name, engagement_score)
        
        return jsonify({
            'faces': face_names,
            'engagement': engagement_score,
            'gaze_status': gaze.get_gaze_status()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def update_attendance(name, engagement):
    try:
        today = date.today().strftime("%Y-%m-%d")
        filename = "attendance.xls"
        
        if not os.path.exists(filename):
            wb = Workbook()
            sheet = wb.add_sheet('Attendance')
            sheet.write(0, 0, 'Date')
            sheet.write(0, 1, 'Name')
            sheet.write(0, 2, 'Status')
            sheet.write(0, 3, 'Engagement')
            wb.save(filename)
        
        rb = xlrd.open_workbook(filename, formatting_info=True)
        wb = xl_copy(rb)
        sheet = wb.get_sheet(0)
        
        row = rb.sheet_by_index(0).nrows
        sheet.write(row, 0, today)
        sheet.write(row, 1, name)
        sheet.write(row, 2, 'Present')
        sheet.write(row, 3, engagement)
        
        wb.save(filename)
        
    except Exception as e:
        print(f"Error updating attendance: {e}")

@app.route('/api/download-attendance', methods=['GET'])
def download_attendance():
    try:
        return send_file(
            'attendance.xls',
            mimetype='application/vnd.ms-excel',
            as_attachment=True,
            download_name=f'attendance_{date.today().strftime("%Y-%m-%d")}.xls'
        )
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