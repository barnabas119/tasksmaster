// Base URL for your API
const API_URL = 'http://localhost:3000/api/tasks';

// Fetch and display all tasks
async function fetchTasks() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();

    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = ''; // Clear the list

    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${task.title}</strong><br>${task.description}`;
      tasksContainer.appendChild(li);
    });
  } catch (error) {
    console.error(error.message);
    alert('Error fetching tasks. Please try again.');
  }
}

// Create a new task
document.getElementById('create-task-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      throw new Error('Failed to add task');
    }

    alert('Task added successfully!');
    fetchTasks(); // Refresh the task list
    e.target.reset(); // Reset the form
  } catch (error) {
    console.error(error.message);
    alert('Error adding task. Please try again.');
  }
});

// Load tasks on page load
document.addEventListener('DOMContentLoaded', fetchTasks);