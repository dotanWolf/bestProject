require("dotenv").config();

const env = process.env.NODE_ENV || "development";
require("custom-env").env(env, "./config");

console.log("Checking Connection String:", process.env.CONNECTION_STRING ? "FOUND" : "NOT FOUND");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// 4. Connect to Mongoose (using modern syntax)
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Mongoose connection error:", err));

var app = express();

const files = require("./routes/files");
const users = require("./routes/users");
const tokens = require("./routes/tokens");
const search = require("./routes/search");

app.use(
  cors({
    allowedHeaders: ["Content-Type", "authorization", "userid"],
    exposedHeaders: ["Location"],
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

app.use("/api/files", files);
app.use("/api/users", users);
app.use("/api/tokens", tokens);
app.use("/api/search", search);

const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => {
  // console.log(`Server running on port ${PORT}`);
});
