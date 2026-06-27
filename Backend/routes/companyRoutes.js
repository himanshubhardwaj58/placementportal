const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const upload = require("../middleware/upload");
const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  approveCompany,
  getMyCompany,
} = require("../controllers/companyController");

// Authenticated: list & view companies
router.get("/", auth, getCompanies);
router.get("/my", auth, roleCheck("recruiter"), getMyCompany);
router.get("/:id", auth, getCompanyById);

// Recruiter: create & update
router.post("/", auth, roleCheck("recruiter"), createCompany);
router.put("/:id", auth, roleCheck("recruiter", "admin"), upload.single("logo"), updateCompany);

// Admin: approve/reject
router.put("/:id/approve", auth, roleCheck("admin"), approveCompany);

module.exports = router;
