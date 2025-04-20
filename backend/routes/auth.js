const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Teacher = require('../models/Teacher');
const Admin = require("../models/Admin");
const { cookies } = require("next/headers");
// const User = require('../models/Admin');
//const auth = require('../middleware/auth');
//const auth = require("../middleware/auth");
const JWT_EXPIRES_IN = "1h"; // can move to config later
router.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
   });
  

router.post("/student/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      registrationNo,
        semester,
       section,
  
      
    } = req.body;

    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    if (!email.endsWith("muj.manipal.edu")) {
      return res
        .status(400)
        .json({ msg: "Student email must be from muj.manipal.edu domain" });
    }

    const student = new Student({
      name,
      email,
      password,
      registrationNo,
      semester, 
      section,
    });
    await student.save();

    const payload = {
      student: {
        id: student.id,
        registrationNo: student.registrationNo,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET_STUDENT,
      { expiresIn: JWT_EXPIRES_IN },
      (err, token) => {
        if (err) {
          console.error("[Auth Register] Token generation error:", err.message);
          return res.status(500).json({ msg: "Token generation failed" });
        }
        //localStorage.setItem("token", token);;
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // ensures cookie is only sent over HTTPS in production
          maxAge: 60 * 60 * 1000, // 1 hour
          sameSite: "Lax", // helps mitigate CSRF
        });
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("[Auth Register]", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});
router.post("/teacher/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      teacherId,
      domain,      
    } = req.body;

    const existingUser = await Teacher.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // if (!email.endsWith("muj.manipal.edu")) {
    //   return res
    //     .status(400)
    //     .json({ msg: "Teacher email must be from muj.manipal.edu domain" });
    // }

    const teacher = new Teacher({
      name,
      email,
      password,
      teacherId,
      domain,
    });
    await teacher.save();

    const payload = {
      teacher: {
        id: teacher.id,
        teacherId: teacher.teacherId,
      },
    };
    console.log("Payload:", payload);
    console.log("Teacher ID:", teacher.id); 
    jwt.sign(
      payload,
      process.env.JWT_SECRET_TEACHER,
      { expiresIn: JWT_EXPIRES_IN },
      (err, token) => {
        if (err) {
          console.error("[Auth Register] Token generation error:", err.message);
          return res.status(500).json({ msg: "Token generation failed" });
        }
       // localStorage.setItem("token", token);;
       res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // ensures cookie is only sent over HTTPS in production
        maxAge: 60 * 60 * 1000, // 1 hour
        sameSite: "Lax", // helps mitigate CSRF
      });
       res.json({
        token,
        user: {
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          teacherId: teacher.teacherId,
          domain: teacher.domain,
          createdAt: teacher.createdAt,
        },
      });
      
      }
    );
  } catch (err) {
    console.error("[Auth Register]", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.post("/student/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide all fields" });
    }
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        registrationNo: user.registrationNo,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET_STUDENT,
      { expiresIn: JWT_EXPIRES_IN },
      (err, token) => {
        if (err) {
          console.error("[Auth Login] Token generation error:", err.message);
          return res.status(500).json({ msg: "Token generation failed" });
        }
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // ensures cookie is only sent over HTTPS in production
          maxAge: 60 * 60 * 1000, // 1 hour
          sameSite: "Lax", // helps mitigate CSRF
        });
      //  localStorage.setItem("token", token);;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            registrationNo: user.registrationNo,
            semester: user.semester,
            section: user.section,
            createdAt: user.createdAt,
          },
        });
      }
    );
  } catch (err) {
    console.error("[Auth Login]", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});
router.post("/teacher/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide all fields" });
    }
    const user = await Teacher.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        teacherId: user.teacherId,
        
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET_TEACHER,
      { expiresIn: JWT_EXPIRES_IN },
      (err, token) => {
        if (err) {
          console.error("[Auth Login] Token generation error:", err.message);
          return res.status(500).json({ msg: "Token generation failed" });
        }
       // localStorage.setItem("token", token);;
       res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // ensures cookie is only sent over HTTPS in production
        maxAge: 60 * 60 * 1000, // 1 hour
        sameSite: "Lax", // helps mitigate CSRF
      });
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            teacherId: user.teacherId,
            domain: user.domain,
            createdAt: user.createdAt,
          },
        });
      }
    );
  } catch (err) {
    console.error("[Auth Login]", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
