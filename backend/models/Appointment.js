const mongoose = require("mongoose");
const AppointmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },

  topic: { type: String },
  notes: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Rejected", "Completed"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});
const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
