const express = require("express");
const teacherAuth = require("../middleware/teacherAuth");
const studentAuth = require("../middleware/studentAuth");
const Teacher = require("../models/Teacher");
const router = express.Router();

// @route   GET /api/teachers
// @desc    Get all teachers
// @access  Private
router.get("/", studentAuth, async (req, res) => {
  try {
    const teachers = await Teacher.find().select("-password").sort({ name: 1 });
    res.json(teachers);
  } catch (err) {
    console.error("[Teachers GET]", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/teachers/:id
// @desc    Get teacher by ID
// @access  Private
router.get("/:id", teacherAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select("-password");
    if (!teacher) return res.status(404).json({ msg: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   PUT /api/teachers/profile
// @desc    Update teacher profile
// @access  Private
router.put("/profile", teacherAuth, async (req, res) => {
  const { name, domain } = req.body;
  const updateFields = {};
  if (name) updateFields.name = name;
  if (domain) updateFields.domain = domain;

  try {
    const updated = await Teacher.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   DELETE /api/teachers/:id
// @desc    Delete teacher by ID (if needed)
// @access  Admin (or modify according to your auth logic)
router.delete("/:id", teacherAuth, async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ msg: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
