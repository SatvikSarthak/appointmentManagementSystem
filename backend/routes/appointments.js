const express = require("express");
const router = express.Router();
const teacherAuth = require("../middleware/teacherAuth");
const studentAuth = require("../middleware/studentAuth");
const Appointment = require("../models/Appointment");
const generateMeetingNotes = require("../utils/generateMeetingNotes");

console.log("Type of Appointment:", typeof Appointment); // should be 'function'



// -------------------- STUDENT ROUTES --------------------

// @route   POST api/appointments/student
// @desc    Create a new appointment request
// @access  Private/Student
router.post("/student/book", studentAuth, async (req, res) => {
  const { teacherId, date, startTime, topic } = req.body;

  try {
    console.log(req.user);
    const newAppointment = new Appointment({
      student: req.user.id,
      teacher: teacherId,
      date: date,
      startTime: startTime, 
      topic: topic,
      status: "Pending",
    });

    newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/appointments/student
// @desc    Get all appointments for logged-in student
// @access  Private/Student
router.get("/student", studentAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ student: req.user.id })
      .populate("teacher", "name email")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// -------------------- TEACHER ROUTES --------------------

// @route   GET api/appointments/teacher
// @desc    Get all appointments for logged-in teacher
// @access  Private/Teacher
router.get("/teacher", teacherAuth, async (req, res) => {
  try {
    // console.log("Authenticated Teacher ID:", req.user.id);
    // console.log("Authenticated Teacher Name:", req.user.name);
    // if(req.user.id === undefined) {return}
    const appointments = await Appointment.find({ teacher: req.user.id })
      .populate("student", "name email registrationNo semester section")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err.message,"satvik");
    res.status(500).send("Server error");
  }
});

// @route   PATCH api/appointments/teacher/:id
// @desc    Accept or reject appointment / generate meeting notes
// @access  Private/Teacher
router.patch("/teacher/:id", teacherAuth, async (req, res) => {
  const { status, generateNotes } = req.body;

  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment || appointment.teacher.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (status && ["Confirmed", "Rejected"].includes(status)) {
      appointment.status = status;
    }

    if (generateNotes && appointment.topic) {
      const notes = await generateMeetingNotes(appointment.topic);
      appointment.notes = notes;
      appointment.status = "Completed";
    }

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

  