const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendNotification,
} = require("../controllers/notificationController");

// All require auth
router.use(auth);

router.get("/", getNotifications);
router.put("/:id/read", markAsRead);
router.put("/read-all", markAllAsRead);
router.delete("/:id", deleteNotification);

// Admin/Recruiter can send notifications
router.post("/", roleCheck("admin", "recruiter"), sendNotification);

module.exports = router;
