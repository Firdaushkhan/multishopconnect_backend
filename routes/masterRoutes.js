const express = require("express");
const router = express.Router();


const User = require("../models/User");
const Demand = require("../models/Demand");
const Offer = require("../models/Offer");

const Notification = require("../models/Notification");

router.post("/reset-master", async (req, res) => {
    console.log("🔥 RESET MASTER API HIT");
  console.log("BODY:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    // deactivate old master
    await User.updateMany(
      { role: "master", status: "active" },
      { status: "inactive" }
    );

    // create new active master
    await User.create({
      name: "Master Admin",
      email,
      password, // plain text
      role: "master",
      status: "active"
    });

    res.json({ message: "Master credentials reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});








module.exports = router;
