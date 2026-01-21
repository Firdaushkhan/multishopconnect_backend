const express = require("express");
const User = require("../models/User");
const router = express.Router();
const mongoose = require("mongoose");   // ✅ THIS LINE


/* ================= CREATE USER ================= */
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password, // (hash later)
      role
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET USERS ================= */
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json(user);
});



// ===============================
// SHOPKEEPER REGISTER
// ===============================
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      category
    } = req.body;

    // 🔒 Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔒 Prevent duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // 🧠 CREATE USER OBJECT (frontend compatible)
    const userData = {
      name,
      email,
      password,
      role,
      status: "active"
    };

    // 🟡 SHOPKEEPER EXTRA FIELDS (DO NOT REMOVE)
    if (role === "shopkeeper") {
      userData.phone = phone || "";
      userData.category = category || "";
      userData.approved = false; // 🔥 IMPORTANT
    }

    const user = await User.create(userData);

    res.status(201).json(user);
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});




// ===============================
// 3️⃣ GET ALL SHOPKEEPERS (MONGO)
// ===============================
router.get("/shopkeepers", async (req, res) => {
  try {
    const shops = await User.find({ role: "shopkeeper" });

    const mapped = shops.map(shop => {
      const created = shop.createdAt
        ? new Date(shop.createdAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })
        : "";

      const approvedDate = shop.updatedAt && shop.approved
        ? new Date(shop.updatedAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })
        : null;

      return {
        ...shop.toObject(),
        allowed: shop.approved,
        timestamp: created,
        approvedAt: approvedDate
      };
    });

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch shopkeepers" });
  }
});



// ===============================
// 4️⃣ USER APPROVES SHOPKEEPER
// ===============================
router.patch("/approve-shopkeeper/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid shopkeeper ID" });
    }

    const shop = await User.findById(id);

    if (!shop) {
      return res.status(404).json({ message: "Shopkeeper not found" });
    }

    // 🔒 NEW GUARD
    if (shop.approved === true) {
      return res.json({
        message: "Shopkeeper already approved",
        shop: {
          ...shop.toObject(),
          allowed: true
        }
      });
    }

    shop.approved = true;
    shop.status = "active";
    await shop.save();

    res.json({
      message: "Shopkeeper approved",
      shop: {
        ...shop.toObject(),
        allowed: true,
        approvedAt: new Date(shop.updatedAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      }
    });

  } catch (err) {
    console.error("🔥 APPROVE ERROR:", err);
    res.status(500).json({ message: "Approval failed" });
  }
});



router.patch("/reject-shopkeeper/:id", async (req, res) => {
  try {
    const shop = await User.findByIdAndUpdate(
      req.params.id,
      {
        approved: false,
        status: "rejected"
      },
      { new: true }
    );

    res.json({
  message: "Shopkeeper rejected",
  shop: {
    ...shop.toObject(),
    allowed: false
  }
});

  } catch {
    res.status(500).json({ message: "Reject failed" });
  }
});







/* 🔍 GET PENDING SHOPKEEPERS */
router.get("/pending-shopkeepers", async (req, res) => {
  const shops = await User.find({
    role: "shopkeeper",
    approved: false
  });

  res.json(shops);
});



// ===============================
// MASTER DASHBOARD STATS (MONGO)
// ===============================
router.get("/master-stats", async (req, res) => {
  try {
    const totalShops = await User.countDocuments({ role: "shopkeeper" });
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalInterns = await User.countDocuments({ role: "intern" });

    res.json({
      shops: totalShops,
      users: totalUsers,
      admins: totalAdmins,
      interns: totalInterns
    });
  } catch (err) {
    console.error("MASTER STATS ERROR:", err);
    res.status(500).json({ message: "Failed to load master stats" });
  }
});



module.exports = router;
