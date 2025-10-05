import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState([]);
  const [listening, setListening] = useState(false);

  // Backend URL — automatically switches between local & live
  const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch existing stories on load
  useEffect(() => {
    fetch(`${API_BASE}/stories`)
      .then((res) => res.json())
      .then((data) => setStories(data.stories || []))
      .catch((err) => console.error("Error fetching stories:", err));
  }, []);

  // 🎙 Voice-to-text feature
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice input. Use Chrome or Edge.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + " " + transcript);
    };

    recognition.start();
  };

  // Send memory to backend for story generation
  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/generate-story`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      if (data.story) {
        setStories((prev) => [
          { memory: input, story: data.story },
          ...prev,
        ]);
        setInput("");
      } else if (data.error) {
        alert("Error from backend: " + data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // Download story as PDF
  const handleDownloadPDF = (storyObj) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Memory:", 10, 10);
    doc.setFontSize(12);
    doc.text(storyObj.memory, 10, 20, { maxWidth: 180 });
    doc.setFontSize(14);
    doc.text("Story:", 10, 50);
    doc.setFontSize(12);
    doc.text(storyObj.story, 10, 60, { maxWidth: 180 });
    doc.save("memory-story.pdf");
  };

  return (
    <div className="container">
      <h1>Timeless Tales</h1>

      <textarea
        rows="3"
        placeholder="Enter a memory or use voice..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div style={{ marginBottom: "10px" }}>
        <button onClick={startListening} disabled={listening}>
          {listening ? "Listening..." : "Record Voice"}
        </button>

        <button onClick={handleSend} disabled={loading}>
          {loading ? "Generating..." : "Send Memory"}
        </button>
      </div>

      {stories.map((item, index) => (
        <div key={index} className="story-card">
          <p><strong>Memory:</strong> {item.memory}</p>
          <p>{item.story}</p>
          <button onClick={() => handleDownloadPDF(item)}>📄 Download PDF</button>
        </div>
      ))}
    </div>
  );
}
