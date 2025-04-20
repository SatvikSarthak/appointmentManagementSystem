const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { METHODS } = require('http');
const cookieParser = require('cookie-parser');
//import cors from 'cors';
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// ✅ Proper CORS Setup
// Middleware
app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:3000', // allow frontend
//   credentials: true,               // allow cookies if used
// }));


const corsOptions ={
    origin:'http://localhost:3000', 
    METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' ,'PATCH'],
    methods: ["GET", "POST", "PUT", "DELETE","OPTIONS" ,"PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,

    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cookieParser());  
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
   });

// Static route for uploaded files (if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/student'));
app.use('/api/teachers', require('./routes/teacher'));
app.use('/api/appointments', require('./routes/appointments'));
//app.use("/api/student/notes", require("./routes/student/notes"));


// Base Route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
