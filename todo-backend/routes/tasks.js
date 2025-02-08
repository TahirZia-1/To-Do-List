const express = require('express');
const router = express.Router();
const { Task } = require('../models');
const authenticateToken = require('../routes/auth');

// Protect all routes
router.use(authenticateToken);

// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create task
router.post('/tasks', async (req, res) => {
  try {
    const { description } = req.body;
    const task = await Task.create({
      description,
      user_id: req.user.id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { 
        task_id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { description, completed } = req.body;
    await task.update({
      description: description !== undefined ? description : task.description,
      completed: completed !== undefined ? completed : task.completed
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const result = await Task.destroy({
      where: { 
        task_id: req.params.id,
        user_id: req.user.id
      }
    });
    
    if (!result) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
