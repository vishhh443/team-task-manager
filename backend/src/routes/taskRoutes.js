const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createTask).get(protect, getTasks);
router.route('/:id/status').put(protect, updateTaskStatus);
router.route('/:id').delete(protect, admin, deleteTask);

module.exports = router;
