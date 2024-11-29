const express = require('express');
const Task = require('../models/task');
const authenticate = require('../middleware/auth'); // Import the authentication middleware

const router = express.Router();

// 1. Create a new task (protected)
router.post('/', authenticate, async (req, res) => {
    console.log(req.body);
  const { title, description, deadline, priority } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const newTask = new Task({
      title,
      description,
      deadline,
      priority,
      user: req.user._id, // Associate task with the logged-in user
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 2. View all tasks (with optional filtering) (protected)
router.get('/', authenticate, async (req, res) => {
  const { priority, dueDate } = req.query;

  const query = { user: req.user._id }; // Fetch tasks for the logged-in user

  if (priority) query.priority = priority; // Filter by priority (low, medium, high)
  if (dueDate) query.deadline = { $lte: new Date(dueDate) }; // Filter by deadline (due before a date)

  try {
    const tasks = await Task.find(query);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 3. Update a task (protected)
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, priority } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id }, // Ensure only the owner can update
      { title, description, deadline, priority },
      { new: true } // Return the updated task
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 4. Delete a task (protected)
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 5. Search for tasks by keyword (protected)
router.get('/search', authenticate, async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: 'Keyword is required for search' });
  }

  try {
    const tasks = await Task.find({
      user: req.user._id, // Ensure only the logged-in user's tasks are searched
      $or: [
        { title: { $regex: keyword, $options: 'i' } }, // Case-insensitive search in title
        { description: { $regex: keyword, $options: 'i' } }, // Case-insensitive search in description
      ],
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;