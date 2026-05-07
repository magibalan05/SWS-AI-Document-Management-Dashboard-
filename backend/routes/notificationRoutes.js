const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

router.get("/notifications", async (req, res) => {
  const notifications = await Notification.find().sort({ timestamp: -1 });
  res.json(notifications);
});

router.put("/notifications/:id", async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ message: "Notification marked as read" });
});

router.put("/notifications", async (req, res) => {
  await Notification.updateMany({}, { read: true });
  res.json({ message: "All notifications marked as read" });
});

module.exports = router;
