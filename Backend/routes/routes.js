const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');

router.post('/projects', projectController.createProject);
router.get('/projects', projectController.getProjects);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

router.post('/tasks', taskController.createTask);
router.get('/tasks/:projectId', taskController.getTasks);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
