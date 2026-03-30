import React, { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text) {
      alert("Please enter some text");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://fake-news-identifier-r6s9.onrender.com/detect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Backend not connected (wait 30s and try again)");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          🤖 AI-Based Fake News Identifier
        </h1>

        <textarea
          placeholder="Enter or paste news here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.textarea}
        />

        <button onClick={analyze} style={styles.button}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {result && (
          <div style={styles.result}>
            <h2
              style={{
                color:
                  result.prediction === "REAL"
                    ? "#4CAF50"
                    : "#FF4C4C",
              }}
            >
              {result.prediction}
            </h2>

            <p style={styles.confidence}>
              Confidence: {result.confidence}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, sans-serif",
  },

  card: {
    background: "#111827",
    padding: "40px",
    borderRadius: "20px",
    width: "500px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    textAlign: "center",
  },

  title: {
    color: "white",
    marginBottom: "20px",
  },

  textarea: {
    width: "100%",
    height: "120px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    marginBottom: "20px",
    background: "#1f2937",
    color: "white",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  result: {
    marginTop: "20px",
    background: "#1f2937",
    padding: "15px",
    borderRadius: "10px",
  },

  confidence: {
    color: "#cbd5e1",
  },
};

export default App;