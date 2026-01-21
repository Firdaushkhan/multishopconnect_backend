const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* 🔥 CREATE ADMIN – MASTER ONLY */
router.post("/create", async (req, res) => {
  try {
    console.log("🔥 ADMIN CREATE HIT");
    console.log("BODY:", req.body);

    const { currentUserRole, name, email, password } = req.body;

    if (currentUserRole !== "master") {
      console.log("❌ NOT MASTER");
      return res.status(403).json({ message: "Access denied" });
    }

    const exists = await User.findOne({ email });
    console.log("EXISTS:", exists);

    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: "admin",
      status: "active"
    });

    console.log("✅ ADMIN CREATED:", admin);

    res.json(admin);
  } catch (err) {
    console.error("❌ ADMIN CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});



/* 🔥 MASTER → GET ALL ADMINS */
router.get("/admins", async (req, res) => {
  try {
    const { role } = req.query;

    // only master allowed
    if (role !== "master") {
      return res.status(403).json({ message: "Access denied" });
    }

    const admins = await User.find({ role: "admin" }).sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});






/* 🔥 ADMIN → CREATE USER / INTERN */
router.post("/create-user", async (req, res) => {
  try {
    console.log("🔥 ADMIN CREATE USER HIT");
    console.log("BODY:", req.body);

    const { currentUserRole, name, email, password, role } = req.body;

    // 🔒 Only admin allowed
    if (currentUserRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // 🔒 Only user / intern can be created by admin
    if (!["user", "intern"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      status: "active"
    });

    console.log("✅ USER CREATED:", user);

    res.json(user);
  } catch (err) {
    console.error("❌ CREATE USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});




// 🔥 MASTER → FETCH ALL USERS (USER + INTERN)
router.get("/all-users", async (req, res) => {
  try {
    const { role } = req.query;

    if (role !== "master") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find({
      role: { $in: ["user", "intern"] }
    }).sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("❌ FETCH USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/update-user-status", async (req, res) => {
  try {
    const { currentUserRole, userId, status } = req.body;

    if (currentUserRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email, role });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  if (user.role === "shopkeeper" && !user.allowed) {
    return res.status(403).json({
      message: "Your shop is pending approval"
    });
  }

  res.json(user);
});





module.exports = router;
