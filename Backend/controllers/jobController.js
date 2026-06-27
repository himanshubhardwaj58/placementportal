const Job = require("../models/Job");
const Company = require("../models/Company");

// ── Create Job ──
const createJob = async (req, res) => {
  try {
    const {
      title, description, type, location, salary,
      eligibility, skills, deadline, companyId,
    } = req.body;

    // Verify company exists and belongs to this recruiter (or admin)
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (req.user.role === "recruiter" && company.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only post jobs for your own company" });
    }

    if (!company.isApproved) {
      return res.status(400).json({ message: "Company must be approved before posting jobs" });
    }

    const job = await Job.create({
      title,
      description,
      company: companyId,
      postedBy: req.user._id,
      type: type || "full-time",
      location: location || "",
      salary: salary || {},
      eligibility: eligibility || {},
      skills: skills || [],
      deadline,
    });

    const populatedJob = await Job.findById(job._id)
      .populate("company", "name logo")
      .populate("postedBy", "name email");

    res.status(201).json({ message: "Job posted successfully", job: populatedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get All Jobs (with filters) ──
const getJobs = async (req, res) => {
  try {
    const {
      search, type, department, minCGPA,
      status, page = 1, limit = 10,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (type) filter.type = type;
    if (status) filter.status = status;
    else filter.status = "open"; // default to open jobs
    if (department) filter["eligibility.departments"] = { $in: [department] };
    if (minCGPA) filter["eligibility.minCGPA"] = { $lte: Number(minCGPA) };

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate("company", "name logo industry")
        .populate("postedBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    res.status(200).json({
      jobs,
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

// ── Get Single Job ──
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company")
      .populate("postedBy", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Update Job ──
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only the poster or admin can update
    if (
      req.user.role !== "admin" &&
      job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("company", "name logo")
      .populate("postedBy", "name email");

    res.status(200).json({ message: "Job updated", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Delete Job ──
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      req.user.role !== "admin" &&
      job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get Jobs by Recruiter ──
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate("company", "name logo")
      .sort({ createdAt: -1 });

    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs };
