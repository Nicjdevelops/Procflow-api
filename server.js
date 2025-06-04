require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Dummy schema + model
const testSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model("Test", testSchema);

// Homepage route
app.get("/", (req, res) => {
  res.send("API Running");
});

// Test MongoDB route
app.get("/test", async (req, res) => {
  try {
    const doc = await Test.create({ name: "Test record" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connect to MongoDB and start server
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
