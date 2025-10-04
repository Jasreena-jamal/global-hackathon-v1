import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    setLoading(true);
    setStory("");

    try {
      const res = await fetch("http://localhost:5000/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      if (data.story) {
        setStory(data.story);
      } else {
        setStory("Error: No story returned. Check backend logs.");
      }
    } catch (err) {
      console.error(err);
      setStory("Error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 600, margin: "auto" }}>
      <h1>Memory Keeper</h1>
      <p>Write down a special memory, and I’ll turn it into a heartwarming story.</p>

      <textarea
        rows="5"
        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        placeholder="Enter your memory..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        style={{
          marginTop: "10px",
          background: "#2563eb",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        onClick={generateStory}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Story"}
      </button>

      {story && (
        <div style={{ marginTop: "20px", padding: "15px", background: "", borderRadius: "8px" }}>
          <h2>✨ Generated Story:</h2>
          <p>{story}</p>
        </div>
      )}
    </div>
  );
}

export default App;
