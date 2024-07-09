//create pilots
const Pilot = require("../database/pilotDb");
const axios = require("axios");
const createPilots = async (req, res) => {
  try {
    let { name, workExperience, profile_img, location, coordinates } =
      req.query;
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

module.exports = createPilots;
