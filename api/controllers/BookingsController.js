const Booking = require("../models/Booking.js");
const PlaceModel = require("../models/Place.js");
const { getUserDataFromToken } = require("../utils/tokenServices.js");

async function createBookingController(req, res) {
  try {
    const userData = await getUserDataFromToken(req);
    const {
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price
    } = req.body;
    
    // Get the place details to fetch owner
    const placeDoc = await PlaceModel.findById(place);
    if (!placeDoc) {
      return res.status(404).json({ error: 'Place not found' });
    }

    const booking = await Booking.create({
      place,
      user: userData.id,
      owner: placeDoc.owner, // Adding the owner from the place
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getBookingsById(req, res) {
  const userData = await getUserDataFromToken(req);
  if (!userData) {
    return res.status(200).json({
      message: "No Bookings Available!",
    });
  }
  res.json(await Booking.find({ user: userData.id }).populate("place"));
}

async function getUserIdFromBookedPlace(req, res) {
  const userData = await getUserDataFromToken(req);
  if (!userData) {
    return res.status(200).json({
      message: "No Bookings Available!",
    });
  }
  res.json(await Booking.find({}).populate("place"));
}

module.exports = {
  createBookingController,
  getBookingsById,
  getUserIdFromBookedPlace,
};
