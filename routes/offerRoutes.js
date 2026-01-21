const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const Demand = require("../models/Demand");
const mongoose = require("mongoose"); // ✅ REQUIRED
console.log("✅ offerRoutes REGISTERED");
/**
 * CREATE OFFER
 * POST /api/offers
 */
router.post("/", async (req, res) => {
  try {
    const o = req.body;

    if (!o.demandId || !o.shopId || !o.quantity || !o.rate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOffer = new Offer({
     offerId:  Number(o.offerId || Date.now()),               // 🔥 localDB style
      demandId: Number(o.demandId),   // 🔥 SAME as demand.id
      demandTitle: o.demandTitle,
      userId: String(o.userId),
      shopId: String(o.shopId),
      shopName: o.shopName,
      shopEmail: o.shopEmail,
      shopPhone: o.shopPhone,
      shopCategory: o.shopCategory,
      quantity: o.quantity,
      rate: o.rate,
      deliveryDate: o.deliveryDate,
      deliveryTime: o.deliveryTime,
      remarks: o.remarks,
      image: o.image || "",
      status: "pending"
    });

    const savedOffer = await newOffer.save();

    // 🔥 EXACT LOCAL DB BEHAVIOUR:
    // push offer inside demand.offers[]
    await Demand.updateOne(
      { id: Number(o.demandId) },
      { $push: { offers: savedOffer } }
    );

    res.status(201).json(savedOffer);

  } catch (err) {
    console.error("🔥 CREATE OFFER ERROR:", err);
    res.status(500).json({ message: "Create offer failed" });
  }
});



/**
 * GET SHOPKEEPER OFFERS
 * GET /api/offers/shop/:shopId
 */
router.get("/shop/:shopId", async (req, res) => {
  try {
    const offers = await Offer.find({
      shopId: String(req.params.shopId)
    });
    res.json(offers);
  } catch {
    res.status(500).json({ message: "Fetch shop offers failed" });
  }
});


/**
 * ACCEPT OFFER
 * PATCH /api/offers/accept/:offerId
 */

router.patch("/accept/:id", async (req, res) => {
  const offer = await Offer.findByIdAndUpdate(
    req.params.id,
    { status: "accepted" },
    { new: true }
  );
  res.json(offer);
});

router.patch("/reject/:id", async (req, res) => {
  const offer = await Offer.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );
  res.json(offer);
});



/**
 * GET USER OFFERS
 * GET /api/offers/user/:userId
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const offers = await Offer.find({
      userId: String(req.params.userId)
    });

    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Fetch user offers failed" });
  }
});




router.patch("/status", async (req, res) => {
  const { offerId, status } = req.body;

  try {
    const updatedOffer = await Offer.findByIdAndUpdate(
      offerId,
      { status },
      { new: true }
    );

    res.json(updatedOffer);
  } catch (err) {
    res.status(500).json({ message: "Offer status update failed" });
  }
});



module.exports = router;