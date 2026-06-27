const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      default: "student",
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // ── Student-specific fields ──
    rollNumber: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },
    batch: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    placementStatus: {
      type: String,
      enum: ["unplaced", "placed", "not-eligible"],
      default: "unplaced",
    },

    // ── Recruiter-specific fields ──
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    designation: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
