const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const teacherSchema = new mongoose.Schema({
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
  teacherId: {
    type:Number,
    required: true
  },

  domain: {
    type: String,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
teacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
  teacherSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
const teacher = mongoose.model('Teacher', teacherSchema);
module.exports = teacher;