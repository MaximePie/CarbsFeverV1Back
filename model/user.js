const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    max: 255,
    min: 6
  },
  objective: {
    type: Number,
    default: 0,
  },
  current: {
    type: Number,
    default: 0,
  },
  lastActivity: {type: Date},
});

const User = mongoose.model('User', userSchema);
module.exports = User;
