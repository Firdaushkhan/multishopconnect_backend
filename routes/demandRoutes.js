const express = require("express");
const Demand = require("../models/Demand");
const mongoose = require("mongoose");
const ExcelJS = require("exceljs");

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





router.get("/export/excel", async (req, res) => {
  try {
    const demands = await Demand.find().populate("offers");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Demands");

    sheet.columns = [
      { header: "S.No", key: "sn", width: 8 },
      { header: "Requirement", key: "requirement", width: 20 },
      { header: "Quantity", key: "quantity", width: 12 },
      { header: "Price", key: "price", width: 12 },
      { header: "Deadline", key: "deadline", width: 15 },
      { header: "Request Delivery Before", key: "delivery", width: 22 },
      { header: "Images", key: "image", width: 30 },
      { header: "Status", key: "status", width: 12 },
      { header: "View", key: "view", width: 15 }
    ];

    demands.forEach((d, i) => {
      sheet.addRow({
        sn: i + 1,
        requirement: d.requirement,
        quantity: d.quantity,
        price: d.expectedPrice,
        deadline: d.deadline,
        delivery: d.requestDeliveryBefore,
        image: d.images?.[0] || "N/A",
        status: d.status,
        view: `View Offers`
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=demands.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Excel export failed" });
  }
});





router.get("/excel-sheet", async (req, res) => {
  const demands = await Demand.find().populate("offers");

  let html = `
  <html>
  <head>
    <title>Demand Excel Sheet</title>
    <style>
      body { font-family: Arial; padding: 20px; }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th, td {
        border: 1px solid #333;
        padding: 8px;
        text-align: left;
        white-space: nowrap;
      }
      th {
        background: #f2f2f2;
      }
      .download-btn {
        margin: 15px 0;
        padding: 10px 16px;
        background: green;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 14px;
      }
    </style>
  </head>
  <body>

  <h2>Demand Excel Sheet Preview</h2>

  <button class="download-btn"
    onclick="window.location.href='/api/demands/export/excel'">
    Download Excel
  </button>

  <table>
    <tr>
      <th>S.No</th>
      <th>Requirement</th>
      <th>Quantity</th>
      <th>Expected Price</th>
      <th>Deadline</th>
      <th>Request Delivery Before</th>
      <th>Images</th>
      <th>Status</th>
      <th>Total Offers</th>
    </tr>
  `;

  demands.forEach((d, i) => {
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${d.requirement}</td>
        <td>${d.quantity}</td>
        <td>${d.expectedPrice}</td>
        <td>${new Date(d.deadline).toLocaleString()}</td>
        <td>${new Date(d.requestDeliveryBefore).toLocaleString()}</td>
        <td>${d.images?.[0] ? `<a href="${d.images[0]}" target="_blank">View</a>` : "N/A"}</td>
        <td>${d.status}</td>
        <td>${d.offers?.length || 0}</td>
      </tr>
    `;
  });

  html += `
    </table>
  </body>
  </html>
  `;

  res.send(html);
});

module.exports = router;
