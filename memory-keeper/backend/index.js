const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Test route
app.get("/ping", (req, res) => {
  res.send("Backend is working!");
});

// Generate story endpoint
app.post("/generate-story", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a loving, creative storyteller." },
        { role: "user", content: `Turn this memory into a heartwarming blog post: ${text}` },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    res.json({ story: completion.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI API error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
