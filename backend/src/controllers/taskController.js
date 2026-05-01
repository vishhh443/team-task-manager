const Task = require('../models/Task');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  const { title, description, dueDate, assignedTo, project } = req.body;

  const task = new Task({
    title,
    description,
    dueDate,
    assignedTo,
    project,
    createdBy: req.user._id,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  let tasks;
  if (req.user.role === 'ADMIN') {
    tasks = await Task.find({})
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
  } else {
    tasks = await Task.find({ assignedTo: req.user._id })
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
  }
  res.json(tasks);
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    // Check if user is assigned to this task or is admin
    if (task.assignedTo.toString() === req.user._id.toString() || req.user.role === 'ADMIN') {
      task.status = status;
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(401).json({ message: 'Not authorized to update this task' });
    }
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

module.exports = { createTask, getTasks, updateTaskStatus, deleteTask };
