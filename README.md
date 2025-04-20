# 📅 Appointment Management System

A full-stack web application that simplifies and organizes the process of booking one-on-one appointments between students and teachers. Designed to reduce scheduling conflicts and improve communication through a smooth and modern interface.

## ✨ Features

- 🔐 Role-based authentication (Student, Teacher, Admin)
- 🗓️ Calendar-based appointment request system
- ✅ Teachers can accept or reject appointment requests
- 🧠 AI-generated meeting notes using hugging face API
- 📊 Dashboards for both students and teachers
- 📅 Integrated calendar previews
- 🎨 Clean, modern, responsive UI
- 🔐 Secure JWT authentication and password hashing across all routes

---

## 🛠️ Tech Stack

### 🔹 Frontend
- **Next.js** (v14.2.10)
- **React** (v18.2.0)
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations
- **JS-Cookie** for client-side cookie management

### 🔹 Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Hugging Face API** for generating meeting notes
- **JWT** for secure authentication
- **bcrypt** for password hashing and verification

---

## 🧠 Architecture Overview

```plaintext
Student/Teacher (Client) ─▶ Next.js Frontend ─▶ Express Backend ─▶ MongoDB
                                                  │
                                                  └──▶ Hugging Face API(Notes Gen)
