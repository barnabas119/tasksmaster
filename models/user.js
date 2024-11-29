const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // This ensures username is required
    trim: true,     // Removes whitespace around the username
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, 'Invalid email format'], // Validates email format
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Ensures password is at least 6 characters
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;