const express = require("express");
const multer = require("multer");
const { uploadByLinkController, imageUploadController } = require("../controllers/UploadController");

const router = express.Router();

const photosMiddleware = multer({ dest: "uploads" });

router.post("/upload-by-link", uploadByLinkController);
router.post("/upload", photosMiddleware.array("photos", 100), imageUploadController)

module.exports = router;