require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

// === Middleware ===
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON body

// === MongoDB schema + model ===
const testSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model("Test", testSchema);

// === API Routes ===

// GET route to fetch all records
app.get("/test", async (req, res) => {
  try {
    const records = await Test.find();
    console.log("Fetched records:", records);  // ✅ Add this
    res.json(records);
  } catch (err) {
    console.error("GET error:", err);  // ✅ Add this
    res.status(500).json({ error: err.message });
  }
});

// POST route to insert data
app.post("/test", async (req, res) => {
  try {
    console.log("POST /test hit:", req.body);

    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      console.log("Invalid input.");
      return res.status(400).json({ error: "Name is required" });
    }

    const doc = await Test.create({ name });
    console.log("Saved to DB:", doc);  // ✅ Add this
    res.json(doc);
  } catch (err) {
    console.error("POST error:", err); // ✅ Log errors
    res.status(500).json({ error: err.message });
  }
});

// === Serve static files from /public ===
app.use(express.static(path.join(__dirname, "public")));

// Fallback to index.html
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
      console.log("Server running on port", process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });