const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {

    offerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Offer",
},

    toId: {
  type: String,   // ✅ matches Offer.shopId
  required: true,
},


    toRole: {
      type: String,
      enum: ["user", "shopkeeper", "admin"],
      required: true,
    },

    type: {
      type: String,
      enum: ["NEW_DEMAND", "NEW_OFFER", "OFFER_STATUS"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model("Notification", notificationSchema);
