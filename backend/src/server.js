import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { ENV } from "./config/env.js";
import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./config/db.js";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";
import chatRoutes from "./routes/chat.route.js";
import "../instrument.mjs";
import * as Sentry from "@sentry/node";
const app = express();

app.use(express.json());
app.use(clerkMiddleware()); //req.auth will be

app.get("/debug-sentry", (req, res) => {
  throw new Error("Sentry error test!");
});

app.get("/", (req, res) => {
  res.send("Hello world! 123");
});

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);

Sentry.setupExpressErrorHandler(app);

const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log("server is started at ", ENV.PORT);
        connectDB();
      });
    }
  } catch (error) {
    console.log("Error in starting server ", error);
    process.exit(1);
  }
};

startServer();

export default app;
