const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Company = require("../models/Company");

// ── Dashboard Stats ──
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalRecruiters,
      totalJobs,
      totalApplications,
      totalCompanies,
      placedStudents,
      openJobs,
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "recruiter" }),
      Job.countDocuments(),
      Application.countDocuments(),
      Company.countDocuments({ isApproved: true }),
      User.countDocuments({ role: "student", placementStatus: "placed" }),
      Job.countDocuments({ status: "open" }),
    ]);

    const totalEligibleStudents = await User.countDocuments({
      role: "student",
      placementStatus: { $ne: "not-eligible" },
    });

    res.status(200).json({
      stats: {
        totalStudents,
        totalRecruiters,
        totalJobs,
        totalApplications,
        totalCompanies,
        placedStudents,
        unplacedStudents: totalEligibleStudents - placedStudents,
        openJobs,
        placementRate: totalEligibleStudents > 0
          ? ((placedStudents / totalEligibleStudents) * 100).toFixed(1)
          : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get All Users ──
const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Toggle User Active Status ──
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot deactivate admin accounts" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: user.isActive ? "User activated" : "User deactivated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Placement Statistics ──
const getPlacementStats = async (req, res) => {
  try {
    // Department-wise placement
    const departmentStats = await User.aggregate([
      { $match: { role: "student", department: { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: "$department",
          total: { $sum: 1 },
          placed: {
            $sum: { $cond: [{ $eq: ["$placementStatus", "placed"] }, 1, 0] },
          },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Company-wise offers
    const companyStats = await Application.aggregate([
      { $match: { status: { $in: ["offered", "accepted"] } } },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      { $unwind: "$jobDetails" },
      {
        $lookup: {
          from: "companies",
          localField: "jobDetails.company",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      { $unwind: "$companyDetails" },
      {
        $group: {
          _id: "$companyDetails.name",
          offers: { $sum: 1 },
        },
      },
      { $sort: { offers: -1 } },
      { $limit: 10 },
    ]);

    // Monthly applications trend
    const monthlyTrend = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      departmentStats,
      companyStats,
      monthlyTrend,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Update User Role (Admin) ──
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["student", "recruiter", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User role updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  getPlacementStats,
  updateUserRole,
};
