const express = require("express");
const User = require("../models/User");
const router = express.Router();

/* ================= REGISTER USER (USER / INTERN) ================= */
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Only allowed self-register roles
  if (!["user", "intern"].includes(role)) {
    return res.status(403).json({ message: "Invalid role" });
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

  res.json(user);
});

// ================= LOGIN (ALL ROLES) =================
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  let user;

if (role === "master") {
  // 🔒 MASTER LOGIN RULE (ONLY ACTIVE MASTER)
  user = await User.findOne({
    email,
    password,
    role: "master",
    status: "active"
  });
} else {
  // 🔓 ALL OTHER ROLES — AS IT IS
  user = await User.findOne({ email });
}


  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 🔥 ROLE CHECK
  if (role && user.role !== role) {
    return res.status(401).json({ message: "Invalid role" });
  }

  // 🔒 STATUS CHECK
  if (user.status !== "active") {
    return res.status(403).json({ message: "Account inactive" });
  }

  // 🛑 SHOPKEEPER APPROVAL CHECK
  if (user.role === "shopkeeper" && user.approved !== true) {
    return res.status(403).json({
      message: "Shopkeeper not approved yet"
    });
  }

  // ✅ SUCCESS
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    approved: user.approved
  });
});






module.exports = router;
