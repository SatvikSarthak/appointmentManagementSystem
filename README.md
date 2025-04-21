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



🔐 Authentication & Security
Every protected route uses JWT-based authentication via a custom middleware.

Passwords are stored using bcrypt hashing for maximum security.

Middleware is applied on all routes (/student, /teacher) to ensure role-level access and session validation.

## 🚀 Installation & Setup
## 1. Clone the Repository
git clone [https://github.com/your-username/appointment-management-system.git](https://github.com/SatvikSarthak/appointmentManagementSystem.git)
cd appointment-management-system
## 2. Install backend & frontend dependencies
npm install
##3. Configure Environment Variables
Create a .env file in the root with the following:
env

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

## 4. Run the Development Server
node server.js

The app will be available at http://localhost:5001

🌟 Future Integrations
📂 Upload timetable via Excel file for auto-scheduling

📍 Real-time location-based meeting previews (Google Maps)

🧠 ML-based time suggestion engine

📈 Admin analytics dashboard

🔔 Real-time notifications

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

📄 License
MIT License

👨‍💻 Developed By
Satvik Sarthak
Manipal University Jaipur

“Scheduling made smarter, one click at a time.”


---

Let me know if you'd like this exported as a downloadable `README.md` file or want help setting it up on GitHub.








