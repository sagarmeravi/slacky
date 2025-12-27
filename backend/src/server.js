import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { ENV } from "./config/env.js";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello world! 123");
});

app.listen(ENV.PORT, () => {
  console.log("server is started at ", ENV.PORT);
});
