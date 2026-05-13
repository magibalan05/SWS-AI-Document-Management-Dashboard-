const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

router.post("/notifications", async (req, res) => {
  try {
    const notification = await Notification.create({
      message: req.body.message,
      type: req.body.type || "info",
      read: false
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/notifications", async (req, res) => {
  const notifications = await Notification.find();
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
