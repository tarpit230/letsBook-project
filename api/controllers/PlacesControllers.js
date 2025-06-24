const jwt = require("jsonwebtoken");
const Place = require("../models/Place.js");
require("dotenv").config();

async function postPlacesController(req, res) {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  try {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.create({
        owner: userData.id,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      res.json(placeDoc);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getUserPlacesController(req, res) {
  const { token } = req.cookies;
  if (!token)
    return res.status(400).json({
      message: "Invalid Request",
    });
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) {
      return res.status(401).json({ message: "Token verification failed" });
    }

    try {
      const { id } = userData;
      return res.json(await Place.find({ owner: id }));
    } catch (dbError) {
      console.error("DB Error:", dbError);
      return res.status(500).json({ message: "Database error" });
    }
  });
}

async function getPlacesWithIdController(req, res) {
    const { id } = req.params;
  res.json(await Place.findById(id));
}

async function updatePlacesController(req, res) {
    const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
}

async function getAllPlacesController(req, res) {
    res.json(await Place.find());
}

module.exports = {
  postPlacesController,
  getUserPlacesController,
  getPlacesWithIdController,
  updatePlacesController,
  getAllPlacesController,
};
