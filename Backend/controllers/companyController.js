const Company = require("../models/Company");

// ── Create Company ──
const createCompany = async (req, res) => {
  try {
    const { name, description, website, industry, locations } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    const existingCompany = await Company.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existingCompany) {
      return res.status(400).json({ message: "A company with this name already exists" });
    }

    const company = await Company.create({
      name,
      description: description || "",
      website: website || "",
      industry: industry || "",
      locations: locations || [],
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Company created, pending admin approval", company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get All Companies ──
const getCompanies = async (req, res) => {
  try {
    const { approved } = req.query;
    const filter = {};

    // Non-admin users only see approved companies
    if (req.user.role !== "admin") {
      filter.isApproved = true;
    } else if (approved !== undefined) {
      filter.isApproved = approved === "true";
    }

    const companies = await Company.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ companies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get Company by ID ──
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate("createdBy", "name email");
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json({ company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Update Company ──
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (
      req.user.role !== "admin" &&
      company.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const allowedFields = ["name", "description", "website", "industry", "locations"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Handle logo upload
    if (req.file) {
      updates.logo = `/uploads/logos/${req.file.filename}`;
    }

    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Company updated", company: updatedCompany });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Approve / Reject Company (Admin only) ──
const approveCompany = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      message: isApproved ? "Company approved" : "Company rejected",
      company,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get My Company (Recruiter) ──
const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ createdBy: req.user._id });
    res.status(200).json({ company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  approveCompany,
  getMyCompany,
};
