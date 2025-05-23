const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  registrationNo: {
    type:Number,
    required: true
  },
  semester:{
    type: Number,
   required: true
  },
  section:{
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
  studentSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;