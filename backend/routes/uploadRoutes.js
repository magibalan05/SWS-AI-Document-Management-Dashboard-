const express = require("express");
const multer = require("multer");
const path = require("path");
const Document = require("../models/Document");
const Notification = require("../models/Notification");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, "uploads/"); },
  filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});

const upload = multer({ storage });

router.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const files = req.files;
    for (let file of files) {
      await Document.create({ filename: file.originalname, filesize: file.size, filepath: file.path });
    }
    if (files.length > 3) {
      await Notification.create({ message: `${files.length} files uploaded successfully`, type: "success" });
    }
    res.json({ message: "Files uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/documents", async (req, res) => {
  const docs = await Document.find().sort({ uploadDate: -1 });
  res.json(docs);
});

router.get("/download/:id", async (req, res) => {
  const doc = await Document.findById(req.params.id);
  res.download(doc.filepath);
});

module.exports = router;
