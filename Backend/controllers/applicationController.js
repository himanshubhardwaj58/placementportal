const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");

// ── Apply to Job ──
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.status !== "open") {
      return res.status(400).json({ message: "This job is no longer accepting applications" });
    }

    // Check if deadline has passed
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({ message: "Application deadline has passed" });
    }

    // Check if already applied
    const existingApp = await Application.findOne({
      job: jobId,
      student: req.user._id,
    });
    if (existingApp) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      student: req.user._id,
      resume: req.user.resumeUrl || "",
    });

    // Increment applications count on job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Withdraw Application ──
const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (application.status !== "applied") {
      return res.status(400).json({ message: "Can only withdraw pending applications" });
    }

    await Job.findByIdAndUpdate(application.job, { $inc: { applicationsCount: -1 } });
    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Application withdrawn" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get My Applications (Student) ──
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate({
        path: "job",
        populate: { path: "company", select: "name logo" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get Applications for a Job (Recruiter/Admin) ──
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only the poster or admin can view
    if (
      req.user.role !== "admin" &&
      job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { status } = req.query;
    const filter = { job: jobId };
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate("student", "name email department cgpa rollNumber resumeUrl skills phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Update Application Status (Recruiter/Admin) ──
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const validStatuses = ["applied", "shortlisted", "interview", "offered", "rejected", "accepted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check authorization
    if (
      req.user.role !== "admin" &&
      application.job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    if (notes !== undefined) application.notes = notes;
    await application.save();

    // Send notification to student
    await Notification.create({
      recipient: application.student,
      title: "Application Update",
      message: `Your application status has been updated to "${status}"`,
      type: "application_update",
      link: `/student/applications`,
    });

    res.status(200).json({ message: "Application status updated", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyToJob,
  withdrawApplication,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};
