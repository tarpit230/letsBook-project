const imageDownloader = require("image-downloader");
const fs = require("fs");

async function uploadByLinkController(req, res) {
    try {
        const { link } = req.body;
        const newName = "photo" + Date.now() + ".jpg";
        await imageDownloader.image({
          url: link,
          dest: __dirname + "/uploads/" + newName,
        });
        res.json(newName);
      } catch (error) {
        console.error("Error downloading/uploading image:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}

async function imageUploadController(req, res) {
    const uploadedFiles = [];
      for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace("uploads\\", ""));
      }
      res.json(uploadedFiles);
}

module.exports = {
    uploadByLinkController,
    imageUploadController,
}