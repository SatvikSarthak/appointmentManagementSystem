// const express = require("express");
// const auth = require("../middleware/authTeacher");
// const path = require("path");
// const fs = require("fs");
// const User = require("../models/Teacher");
// const router = express.Router();

// // @route   GET api/users/teachers
// // @desc    Get all teachers
// // @access  Private
// router.get("/teachers", auth, async (req, res) => {
//   try {
//     const teachers = await User.find({ userType: "teacher" })
//       .select("-password")
//       .sort({ name: 1 });

//     res.json(teachers);
//   } catch (err) {
//     console.error("[Get Teachers]", err.message);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // @route   GET api/users/students
// // @desc    Get all students (admin only)
// // @access  Private/Admin
// router.get("/students", auth, async (req, res) => {
//   try {
//     if (req.user.userType !== "admin") {
//       return res.status(403).json({ msg: "Access denied: Admins only" });
//     }

//     const students = await User.find({ userType: "student" })
//       .select("-password")
//       .sort({ name: 1 });

//     res.json(students);
//   } catch (err) {
//     console.error("[Get Students]", err.message);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // @route   PUT api/users/profile
// // @desc    Update user profile
// // @access  Private
// router.put("/profile", auth, async (req, res) => {
//   try {
//     const { name, domain } = req.body;

//     const profileFields = {};
//     if (name) profileFields.name = name;
//     if (domain) profileFields.domain = domain;

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       { $set: profileFields },
//       { new: true }
//     ).select("-password");

//     res.json(updatedUser);
//   } catch (err) {
//     console.error("[Update Profile]", err.message);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// module.exports = router;
