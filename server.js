require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("API Running"));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})      
.then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log("Server running")
  );
});
