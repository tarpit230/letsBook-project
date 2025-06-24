const express = require("express");
const { postPlacesController, getUserPlacesController, getPlacesWithIdController, getAllPlacesController, updatePlacesController } = require("../controllers/PlacesControllers");
const { createBookingController, getBookingsById, getUserIdFromBookedPlace } = require("../controllers/BookingsController");
const { auth, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.post("/places", postPlacesController)
router.get("/user-places", auth, authorizeRoles('admin'), getUserPlacesController)
router.get("/places/:id", getPlacesWithIdController);
router.put("/places", updatePlacesController);
router.get("/places", getAllPlacesController);
router.post("/bookings", createBookingController)
router.get("/bookings", getBookingsById)
router.get("/bookings/all", getUserIdFromBookedPlace);

module.exports = router;