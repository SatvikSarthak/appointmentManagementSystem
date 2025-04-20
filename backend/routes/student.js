const express = require("express");
const auth = require("../middleware/studentAuth");
const Student = require("../models/Student");
const router = express.Router();
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
// @route   GET /api/students
// @desc    Get all students
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const students = await Student.find().select("-password").sort({ name: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
router.get("/notes/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid appointment ID" });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("student", "name email");

    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });

    if (appointment.student._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized access to this note" });
    }

    res.status(200).json({
      topic: appointment.topic,
      date: appointment.date,
      status: appointment.status,
      notes: appointment.notes,
      teacher: appointment.teacher,
    });
  } catch (err) {
    console.error("Error fetching note:", err);
    res.status(500).json({ error: "Server error", err: err.message });
  }
});
// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) return res.status(404).json({ msg: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(404).json({ msg: "Server error" });
  }
});

// @route   PUT /api/students/profile
// @desc    Update student profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  const { name, semester, section } = req.body;
  const updateFields = {};
  if (name) updateFields.name = name;
  if (semester) updateFields.semester = semester;
  if (section) updateFields.section = section;

  try {
    const updated = await Student.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete student by ID (admin access if applicable)
// @access  Admin
router.delete("/:id", auth, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ msg: "Student deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
