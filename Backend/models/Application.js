const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "interview",
        "offered",
        "rejected",
        "accepted",
      ],
      default: "applied",
    },
    resume: {
      type: String, // URL snapshot at time of application
      default: "",
    },
    notes: {
      type: String, // recruiter notes
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
