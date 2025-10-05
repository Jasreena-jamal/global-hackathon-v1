const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 5000;

// ✅ Middleware setup
app.use(cors());
app.use(bodyParser.json());

// 🧼 Prevent caching of API responses
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// ✅ OpenAI setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🧠 In-memory story store
let storyHistory = [];
console.log("Story history cleared on server start");

// ✅ Health check
app.get("/ping", (req, res) => {
  res.send("Backend is working!");
});

// Get all stories
app.get("/stories", (req, res) => {
  res.json({ stories: storyHistory });
});

// Generate new story
app.post("/generate-story", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a loving, creative storyteller for families." },
        { role: "user", content: `Turn this memory into a heartwarming blog post: ${text}` },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const story = completion.choices[0].message.content;
    storyHistory.push({ memory: text, story });

    res.json({ story, history: storyHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI API error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
