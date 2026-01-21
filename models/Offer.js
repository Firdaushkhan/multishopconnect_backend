const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  offerId: {
    type: Number,
    required: true,
    unique: true
  },

  demandId: {
    type: Number, // 🔥 localDB style
    required: true
  },

  demandTitle: String,

  userId: {
    type: String // number/string both ok
  },

  shopId: {
    type: String // number/string both ok
  },

  shopName: String,
  shopEmail: String,
  shopPhone: String,
  shopCategory: String,

  quantity: String,
  rate: String,

  deliveryDate: String,
  deliveryTime: String,

  remarks: String,
  image: String,

  status: {
    type: String,
    default: "pending"
  },

  submittedAt: {
    type: String,
    default: () => new Date().toLocaleString()
  }
});

module.exports = mongoose.model("Offer", offerSchema);
