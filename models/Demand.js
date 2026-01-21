const mongoose = require("mongoose");

const demandSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },

  userId: {
    type: String, // number ya string dono allow
    required: true
  },

  userName: String,
  userEmail: String,

  title: {
    type: String,
    required: true
  },


  // 🔴 ADD START (yahin se add karo)

  quantity: {
  type: String,      // 🔥 SAME AS OFFER
},


  deliveryRequestBefore: {
    type: String // locale string (date + time)
  },




  price: {
    type: String, // 🔥 IMPORTANT (Negotiable allowed)
    default: "Negotiable"
  },

  deadline: {
    type: String // locale string as-is
  },

  deadlineTimestamp: {
    type: Number
  },

  description: {
    type: String,
    default: "No description"
  },

 
  image: {
  type: String,      // 🔥 base64 (offer jaisa)
},
 
  status: {
    type: String,
    default: "active"
  },

  offers: {
    type: Array,
    default: []
  },

  createdAt: {
    type: String,
    default: () => new Date().toLocaleString() // localDB style
  },

  createdAtTimestamp: {
    type: Number,
    default: () => Date.now()
  }
});

module.exports = mongoose.model("Demand", demandSchema);
