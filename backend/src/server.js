import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { serve } from "inngest/express";
import { inngest, functions } from "./config/inngest.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

const streamClient =
  STREAM_API_KEY && STREAM_API_SECRET
    ? StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET)
    : null;

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/api/chat/token/stream", (req, res) => {
  try {
    if (!streamClient) {
      return res.status(500).json({ error: "Stream not configured" });
    }

    const userId = "test-user-" + Date.now();
    const token = streamClient.createToken(userId);

    res.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use("/api/inngest", serve({ client: inngest, functions: functions }));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
