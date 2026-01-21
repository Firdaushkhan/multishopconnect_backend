const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

/**
 * GET notifications by user/shopkeeper
 */
router.get("/:role/:id", async (req, res) => {
  const { role, id } = req.params;

  try {
    const notifications = await Notification.find({
      toRole: role,
      toId: id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

/**
 * MARK single notification as read
 */
router.patch("/:id/read", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification" });
  }
});

/**
 * MARK ALL notifications as read
 */
router.patch("/mark-all-read/:role/:id", async (req, res) => {
  const { role, id } = req.params;

  try {
    await Notification.updateMany(
      { toRole: role, toId: id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark all read" });
  }
});

module.exports = router;
