const mongoose = require("mongoose");

const masterCredentialSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true // plain text, no restriction
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "MasterCredential",
  masterCredentialSchema
);
