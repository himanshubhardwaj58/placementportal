const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const {
  applyToJob,
  withdrawApplication,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

// Student routes
router.post("/apply/:jobId", auth, roleCheck("student"), applyToJob);
router.delete("/:id/withdraw", auth, roleCheck("student"), withdrawApplication);
router.get("/my", auth, roleCheck("student"), getMyApplications);

// Recruiter/Admin routes
router.get("/job/:jobId", auth, roleCheck("recruiter", "admin"), getJobApplications);
router.put("/:id/status", auth, roleCheck("recruiter", "admin"), updateApplicationStatus);

module.exports = router;
