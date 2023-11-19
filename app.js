const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// In-memory storage for tasks
let tasks = [];

// Middleware for basic validation
function validateTask(req, res, next) {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }
  next();
}

// Routes
app.get('/tasks', (req, res) => {
  // Implement pagination if needed
  res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(task => task.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  res.status(200).json(task);
});

app.post('/tasks', validateTask, (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    description: req.body.description,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.put('/tasks/:id', validateTask, (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  tasks[taskIndex] = {
    id: taskId,
    title: req.body.title,
    description: req.body.description,
  };

  res.status(200).json(tasks[taskIndex]);
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== taskId);

  res.status(204).end();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
