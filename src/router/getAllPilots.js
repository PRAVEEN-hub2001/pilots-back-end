const Pilot = require("../database/pilotDb");

// get all pilots
const getAllPilots = async (req, res) => {
  try {
    const pilots = await Pilot.find();
    res.json(pilots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export functions
module.exports = getAllPilots;
