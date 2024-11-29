const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;