from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

# Initialize app
app = Flask(__name__)
CORS(app)

# Load model and vectorizer
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

# Home route (important for Render testing)
@app.route("/")
def home():
    return "Fake News Detection API is running 🚀"

# Prediction route
@app.route("/detect", methods=["POST"])
def detect():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data["text"]

    # Transform input
    transformed = vectorizer.transform([text])

    # Predict
    prediction = model.predict(transformed)[0]

    result = "Fake News ❌" if prediction == 0 else "Real News ✅"

    return jsonify({
        "prediction": result
    })

# IMPORTANT: Render-compatible run
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)