const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/jobController");

// Public: browse jobs (auth still required to see them)
router.get("/", auth, getJobs);
router.get("/:id", auth, getJobById);

// Recruiter: manage own jobs
router.post("/", auth, roleCheck("recruiter", "admin"), createJob);
router.get("/my/posted", auth, roleCheck("recruiter"), getMyJobs);
router.put("/:id", auth, roleCheck("recruiter", "admin"), updateJob);
router.delete("/:id", auth, roleCheck("recruiter", "admin"), deleteJob);

module.exports = router;
