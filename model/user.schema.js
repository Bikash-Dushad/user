const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others", ""],
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    isRegistered: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "blocked", "deleted"],
      default: "active",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
