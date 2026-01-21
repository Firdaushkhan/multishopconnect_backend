const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const authRoutes = require("../routes/authRoutes");
const cors = require("cors");
require("dotenv").config();





const demandRoutes = require("../routes/demandRoutes");
const offerRoutes = require("../routes/offerRoutes");
const notificationRoutes = require("../routes/notificationRoutes");
const masterRoutes = require("../routes/masterRoutes");
const userRoutes = require("../routes/userRoutes");
const adminRoutes = require("../routes/adminRoutes");



const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));




/* ================= 🔥 MONGODB CONNECT (VERY IMPORTANT) ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use("/api/demands", demandRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);




const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // 🔹 REGISTER USER / SHOPKEEPER
  socket.on("register", ({ id, role }) => {
  if (role === "shopkeeper") {
    socket.join("shopkeepers");          // for NEW_DEMAND
    socket.join(`shopkeeper_${id}`);     // for OFFER_STATUS
    console.log("🟢 Shopkeeper joined:", id);
  }

  if (role === "user") {
    socket.join(`user_${id}`);
    console.log("🟢 User joined:", id);
  }
});


  socket.on("new_demand_created", async (data) => {
  try {
    await Notification.create({
      toRole: "shopkeeper",
      toId: data.userId, // (future me all shop logic change kar sakte ho)
      type: "NEW_DEMAND",
      message: data.message,
    });

    io.to("shopkeepers").emit("notify_shopkeepers", {
      type: "NEW_DEMAND",
      message: data.message,
      toRole: "shopkeeper",
    });
  } catch (err) {
    console.error("Notification save failed", err);
  }
});





  socket.on("offer_sent", async (data) => {
  try {
    await Notification.findOneAndUpdate(
  {
    toRole: "shopkeeper",
    offerId: data.offerId, // 👈 SAME OFFER
  },
  {
    toId: data.shopkeeperId,
    message: data.message,
    type: "NEW_OFFER",
    isRead: false,
  },
  {
    upsert: true,   // 👈 create once, then update
    new: true,
  }
);


    io.to(`user_${data.userId}`).emit("notify_user", {
      type: "NEW_OFFER",
      message: data.message,
    });
  } catch (err) {
    console.error("Offer notification failed", err);
  }
});



// 🔔 OFFER STATUS → SHOPKEEPER
socket.on("offer_status_changed", async (data) => {
  console.log("🔥 OFFER STATUS EVENT:", data);

  await Notification.findOneAndUpdate(
    {
      offerId: data.offerId,
      toRole: "shopkeeper",
      toId: data.shopkeeperId,
    },
    {
      message: data.message,
      type: "OFFER_STATUS",
      isRead: false,
    },
    { upsert: true }
  );

  io.to(`shopkeeper_${data.shopkeeperId}`).emit(
    "notify_shopkeepers",
    {
      type: "OFFER_STATUS",
      message: data.message,
    }
  );
});

});



app.get("/", (req, res) => {
  res.send("Socket server running");
});

server.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});


