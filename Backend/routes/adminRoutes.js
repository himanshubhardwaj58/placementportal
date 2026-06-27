const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  getPlacementStats,
  updateUserRole,
} = require("../controllers/adminController");

// All admin-only routes
router.use(auth, roleCheck("admin"));

router.get("/stats", getDashboardStats);
router.get("/users", getUsers);
router.put("/users/:id/toggle-status", toggleUserStatus);
router.put("/users/:id/role", updateUserRole);
router.get("/placement-stats", getPlacementStats);

module.exports = router;
