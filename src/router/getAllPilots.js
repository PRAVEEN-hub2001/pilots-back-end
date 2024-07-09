const Pilot = require("../database/pilotDb");
const axios = require("axios");

// get all pilots
const getAllPilots = async (req, res) => {
  try {
    const pilots = await Pilot.find();
    res.json(pilots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//create pilots
const createPilots = async (req, res) => {
  try {
    let { name, workExperience, profile_img, location, coordinates } = req.body;
    const { lat, lng } = coordinates;

    if (!location) {
      const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      if (!response.statusText) {
        throw new Error("Failed to fetch location data");
      }
      const { data } = response;
      location = `${data.locality}, ${data.city}`;
    } else {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
      );
      if (!response.statusText) {
        throw new Error("Invalid city name");
      }
      const { data } = response;
      if (data.length > 0) {
        const { lat, lon } = data[0];
        coordinates = { lat: lat, lng: lon };
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
};

// distance calculation
const distance = (req, res) => {
  const { lat1, lon1, lat2, lon2 } = req.body;
  const R = 6371;

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
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// export functions
module.exports = createPilots;
module.exports = distance;
module.exports = getAllPilots;
