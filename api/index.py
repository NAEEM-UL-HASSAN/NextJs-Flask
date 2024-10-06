from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = YOLO('src\\model\\best.pt')

@app.route("/api/healthchecker", methods=["GET"])
def healthchecker():
    return {"status": "success", "message": "Integrate Flask Framework with Next.js"}

@app.route('/api/detect', methods =['POST'])
def detectIngredient():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    # Get the uploaded image
    image_file = request.files['image']
    image = Image.open(image_file.stream)

    # Run YOLOv8 model on the image
    results = model(image)

    # Extract class indices from the results
    class_ids = results[0].boxes.cls.cpu().numpy()

    # Map class indices to object names
    object_names = [model.names[int(class_id)] for class_id in class_ids]

    return jsonify({'detected_objects': object_names})

if __name__ == "__main__":
    app.run()