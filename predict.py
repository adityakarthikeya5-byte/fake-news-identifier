from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend (Vercel)

# Load model and vectorizer
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

# Home route (to check backend is running)
@app.route("/")
def home():
    return "Backend is running!"

# Prediction route
@app.route("/detect", methods=["POST"])
def detect():
    try:
        data = request.get_json()
        text = data["text"]

        # Transform input
        transformed = vectorizer.transform([text])

        # Predict
        prediction = model.predict(transformed)[0]

        result = "Fake News" if prediction == 1 else "Real News"

        return jsonify({
            "prediction": result
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

# Run app (IMPORTANT FOR RENDER)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)