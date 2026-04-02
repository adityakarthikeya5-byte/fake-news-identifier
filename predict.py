# app.py (at project ROOT — not inside any subfolder)
import os
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# ✅ Fix 1: Explicit CORS config (replace with your actual Vercel URL)
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://fake-news-identifier-khaki.vercel.app",
            "http://localhost:3000"  # for local dev
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# ✅ Fix 2: Handle preflight OPTIONS requests explicitly
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        return response, 200

# Load model once at startup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = pickle.load(open(os.path.join(BASE_DIR, "model.pkl"), "rb"))
vectorizer = pickle.load(open(os.path.join(BASE_DIR, "vectorizer.pkl"), "rb"))

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "Backend is running ✅"})

@app.route("/detect", methods=["POST", "OPTIONS"])
def detect():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400

    text = data["text"]
    vectorized = vectorizer.transform([text])
    prediction = model.predict(vectorized)[0]
    confidence = model.predict_proba(vectorized).max()

    return jsonify({
        "prediction": "Fake" if prediction == 1 else "Real",
        "confidence": round(float(confidence) * 100, 2)
    })

# ✅ Fix 3: Correct port binding for Render
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=False)
