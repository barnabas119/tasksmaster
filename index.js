const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');  // Import auth routes
const taskRoutes = require('./routes/task');

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);  // Use /api/auth for registration and login
app.use('/api/tasks',taskRoutes);

// Connect to MongoDB

console.log('MONGODB_URI:', process.env.MONGODB_URI);  // Add this line to check the value of MONGODB_URI
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err.message);
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});