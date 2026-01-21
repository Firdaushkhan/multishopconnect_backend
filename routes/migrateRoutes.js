const express = require("express");
const User = require("../models/User");

const router = express.Router();

/**
 * MIGRATE USERS FROM localDB JSON
 * body: { users: [...] }
 */
router.post("/users", async (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users)) {
      return res.status(400).json({ message: "Invalid users data" });
    }

    let inserted = 0;
    let skipped = 0;

    for (const u of users) {
      if (!u.email) {
        skipped++;
        continue;
      }

      const exists = await User.findOne({ email: u.email });
      if (exists) {
        skipped++;
        continue;
      }

      await User.create({
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role || "user",
        status: u.status || "active",
        createdAt: u.createdAt
      });

      inserted++;
    }

    res.json({
      message: "Migration completed",
      inserted,
      skipped
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
