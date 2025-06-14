require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());

// ✅ Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));
// === GET route to fetch all records
app.get("/test", async (req, res) => {
  try {
    const records = await Test.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === MongoDB schema + model
const testSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model("Test", testSchema);

// === POST route to insert data
app.post("/test", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Name is required and must be a non-empty string." });
    }

    const doc = await Test.create({ name });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Connect to MongoDB and start the server
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