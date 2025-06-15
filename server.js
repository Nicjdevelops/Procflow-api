require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());

// === MongoDB schema + model ===
const testSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model("Test", testSchema);

// === API Routes ===

// GET route to fetch all records
app.get("/test", async (req, res) => {
  try {
    const records = await Test.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST route to insert data
app.post("/test", async (req, res) => {
  try {
    console.log("POST /test hit:", req.body); // ✅ Log inside JS

    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    const doc = await Test.create({ name });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Serve static files from /public ===
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// === Connect to MongoDB and start server ===
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });