// frontend/src/App.js
import { useState, useEffect } from "react";

const BACKEND_URL = "https://fake-news-identifier-3dhe.onrender.com"; // ← your Render URL

function App() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendReady, setBackendReady] = useState(false);
  const [error, setError] = useState(null);

  // Wake up backend on page load (handles Render cold start)
  useEffect(() => {
    fetch(`${BACKEND_URL}/`)
      .then((res) => res.json())
      .then(() => setBackendReady(true))
      .catch(() => setBackendReady(false));
  }, []);

  const analyzeText = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/detect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Backend not reachable. It may be waking up — wait 30 seconds and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🤖 AI-Based Fake News Identifier</h1>

      {/* Backend status indicator */}
      <p style={{ color: backendReady ? "lightgreen" : "orange", marginBottom: "10px" }}>
        {backendReady ? "✅ Backend connected" : "⏳ Backend warming up..."}
      </p>

      <textarea
        style={styles.textarea}
        placeholder="Paste a news headline or article here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={5}
      />

      <button
        style={styles.button}
        onClick={analyzeText}
        disabled={loading || !inputText.trim()}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {/* Error message */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Result */}
      {result && (
        <div style={{
          ...styles.result,
          borderColor: result.prediction === "Fake News" ? "#ff4d4d" : "#4dff88"
        }}>
          <h2 style={{ color: result.prediction === "Fake News" ? "#ff4d4d" : "#4dff88" }}>
            {result.prediction}
          </h2>
          <p>Confidence: {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0d1b2a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
    color: "white",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    textAlign: "center",
  },
  textarea: {
    width: "100%",
    maxWidth: "600px",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#1a2a3a",
    color: "white",
    fontSize: "1rem",
    resize: "vertical",
  },
  button: {
    marginTop: "15px",
    padding: "12px 40px",
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    width: "100%",
    maxWidth: "600px",
  },
  result: {
    marginTop: "25px",
    padding: "20px 40px",
    borderRadius: "10px",
    border: "2px solid",
    textAlign: "center",
  },
  error: {
    color: "orange",
    marginTop: "15px",
    maxWidth: "600px",
    textAlign: "center",
  },
};

export default App;