const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  uploadResume,
  changePassword,
} = require("../controllers/authController");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Protected routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single("avatar"), updateProfile);
router.post("/upload-resume", auth, upload.single("resume"), uploadResume);
router.put("/change-password", auth, changePassword);

module.exports = router;