const mongoose = require("mongoose");

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

module.exports = Pilot;
