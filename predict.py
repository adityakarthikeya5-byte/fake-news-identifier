from flask import Flask, request, jsonify
import pickle
import os

app = Flask(__name__)

# Load model and vectorizer
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

@app.route("/")
def home():
    return "Backend is running!"

@app.route("/detect", methods=["POST"])
def detect():
    data = request.get_json()
    text = data["text"]

    transformed = vectorizer.transform([text])
    prediction = model.predict(transformed)[0]

    return jsonify({
        "prediction": "Fake News" if prediction == 1 else "Real News"
    })

# VERY IMPORTANT FOR RENDER
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)