import React, { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const checkNews = async () => {
    const res = await fetch("https://fake-news-identifier-r6s9.onrender.com/predict", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ text })
});

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{
      fontFamily: "Arial",
      background: "#0f172a",
      minHeight: "100vh",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>

      <div style={{
        background: "#1e293b",
        padding: "30px",
        borderRadius: "15px",
        width: "600px",
        boxShadow: "0 0 20px rgba(0,0,0,0.5)"
      }}>

        <h1 style={{ textAlign: "center" }}>
          🧠 AI-Based Fake News Identifier 
        </h1>

        <textarea
          rows="6"
          placeholder="Paste news article here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            marginTop: "15px"
          }}
        />

        <button
          onClick={checkNews}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            background: "#3b82f6",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Analyze News
        </button>

        {result && (
          <div style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "10px",
            background:
              result.prediction === "FAKE NEWS"
                ? "#7f1d1d"
                : "#14532d"
          }}>

            <h2>
              {result.prediction}
            </h2>

            <p>
              Confidence: {result.confidence}%
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;