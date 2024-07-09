const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config({ path: "./.env" });

const getAllPilots = require("./router/getAllPilots");
const createPilots = require("./router/createPilots");
const distance = require("./router/distance");

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
app.get("/api/pilots", getAllPilots);
app.post("/api/pilots", createPilots);
app.post("/api/distance", distance);

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
