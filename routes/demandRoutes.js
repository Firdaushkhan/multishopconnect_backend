const express = require("express");
const Demand = require("../models/Demand");
const mongoose = require("mongoose");

const router = express.Router();




/**
 * CREATE DEMAND
 * POST /api/demands
 */
router.post("/", async (req, res) => {
  try {
    const d = req.body;

    if (!d.title || !d.userId  || !d.quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔥 LOCAL DB STYLE deadlineTimestamp
    let deadlineTimestamp = Date.now() + 365 * 24 * 60 * 60 * 1000;
    if (d.deadline) {
      const ts = new Date(d.deadline).getTime();
      if (!isNaN(ts)) deadlineTimestamp = ts;
    }

    const newDemand = new Demand({
      id: Date.now(),
      userId: String(d.userId),          // ✅ STRING (consistent)
      userName: d.userName,
      userEmail: d.userEmail,
      title: d.title,
      quantity: d.quantity,  
      price: d.price || "Negotiable",
      deadline: d.deadline || "",
      deadlineTimestamp,
      deliveryRequestBefore: d.deliveryRequestBefore || "",
      description: d.description || "No description",
      image: d.image || "",
      status: "active",
      offers: []
    });

    const saved = await newDemand.save();
    res.status(201).json(saved);

  } catch (err) {
    console.error("CREATE DEMAND ERROR 👇", err);
    res.status(500).json({ message: "Create demand failed" });
  }
});

/**
 * GET ALL DEMANDS (USER / SHOPKEEPER)
 * WITH 1 HOUR GRACE PERIOD
 */
router.get("/", async (req, res) => {
  try {
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    const demands = await Demand.find({
      deadlineTimestamp: {
        $gte: now - ONE_HOUR   // 🔥 deadline + 1 hour tak
      }
    }).sort({ id: -1 });

    res.json(demands);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch demands" });
  }
});





/**
 * USER DASHBOARD – MY DEMANDS
 * GET /api/demands/user/:userId
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const demands = await Demand.find({
      userId: String(req.params.userId)
    }).sort({ createdAt: -1 });

    res.json(demands);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user demands" });
  }
});



module.exports = router;
