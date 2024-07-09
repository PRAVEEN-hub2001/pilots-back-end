const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

// MongoDB Connection
mongoose
  .connect(process.env.DB_URL.replace("<PASSWORD>", process.env.DB_PASSWORD))
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

// Pilot Schema
const pilotSchema = new mongoose.Schema({
  name: String,
  profileImage: String,
  workExperience: Number,
  location: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
});
const Pilot = mongoose.model("Pilot", pilotSchema);

// API Endpoints
// Example endpoint to fetch all pilots
app.get("/api/pilots", async (req, res) => {
  try {
    const pilots = await Pilot.find();
    res.json(pilots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/pilots", async (req, res) => {
  try {
    let { name, workExperience, profile_img, location, coordinates } = req.body;
    const { lat, lng } = coordinates;
    
    if (!location) {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }
      const data = await response.json();
      location = `${data.locality}, ${data.city}`;
    }
    else { 
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
      );
      if (!response.ok) {
        throw new Error("Invalid city name");
      }
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon } = data[0];
        coordinates = { lat, lng: lon };
      } else {
        throw new Error("Invalid city name");
      }
    }

    const pilot = await Pilot.create({
      name,
      profileImage: profile_img,
      workExperience,
      location,
      coordinates,
    });

    return res.status(200).json({ message: "Successfully Created!", pilot });
  } catch (err) {
    return res.status(500).json({ message: "Creation Failed!" });
  }
});

// Example endpoint to calculate distance between two coordinates
app.post("/api/distance", (req, res) => {
  const { lat1, lon1, lat2, lon2 } = req.body;
  const R = 6371; // Radius of the Earth in kilometers

  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  res.json({ distance });
});

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
