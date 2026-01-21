const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./server/index"); // 👈 socket server start

const connectDB = require("./config/db");
const demandRoutes = require("./routes/demandRoutes");
const offerRoutes = require("./routes/offerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();

/* 🔥 VERY IMPORTANT – CORS FIX */
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true

}));

app.use(express.json());


// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/migrate", require("./routes/migrateRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/notifications", notificationRoutes);
app.use("/api/demands", demandRoutes);
app.use("/api/offers", offerRoutes);
// Connect DB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
