require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// === MongoDB schema + model ===
const testSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model("Test", testSchema);

// === API Routes ===
app.get("/test", async (req, res) => {
  try {
    const records = await Test.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/test", async (req, res) => {
  try {
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

// === Serve static frontend files ===
// This assumes 'public' is at the same level as 'src'
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// === Connect to MongoDB and start server ===
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });