const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["master", "admin", "user", "intern", "shopkeeper"],
      default: "user"
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    /* 🔥 SHOPKEEPER FIELDS */
    shopName: { type: String },
    phone: { type: String },
    category: { type: String },

    approved: {
      type: Boolean,
      default: false
    },
    approvedAt: {
      type: Boolean,
    default: false
  }
  },
  { timestamps: true }
);



module.exports = mongoose.model("User", userSchema);
