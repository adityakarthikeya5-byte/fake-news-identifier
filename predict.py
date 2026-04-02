from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)

# ✅ THIS LINE FIXES YOUR ISSUE
CORS(app)

# Load model and vectorizer
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

@app.route("/")
def home():
    return "Backend is running!"

@app.route("/detect", methods=["POST"])
def detect():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data["text"]

    vector = vectorizer.transform([text])
    prediction = model.predict(vector)[0]

    return jsonify({
        "prediction": "Real News" if prediction == 1 else "Fake News"
    })

# ✅ IMPORTANT FOR RENDER
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)