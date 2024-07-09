const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config({ path: "./.env" });

const getAllPilots = require("./router/getAllPilots");
const createPilots = require("./router/getAllPilots");
const distance = require("./router/getAllPilots");

const app = express();
const PORT = process.env.PORT || 5000;

var corsOptions = {
  origin: "https://praveen-hub2001.github.io",
  optionsSuccessStatus: 200,
};

// MongoDB Connection
mongoose
  .connect(process.env.DB_URL.replace("<PASSWORD>", process.env.DB_PASSWORD))
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

// API Endpoints
app.route("/api/pilots").get(getAllPilots);
app.post("/api/pilots", (req, res) => {
  console.log(req.body);
});
app.route("/api/distance").post(distance);

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
