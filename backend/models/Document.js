const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  filename: String,
  filesize: Number,
  filepath: String,
  status: { type: String, default: "Completed" },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Document", documentSchema);
