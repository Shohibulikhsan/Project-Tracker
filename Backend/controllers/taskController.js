const Task = require('../models/TaskModel');
const Project = require('../models/ProjectModel');

const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();

    const project = await Project.findById(task.project);
    if (project) {
      project.tasks.push(task._id);
      await project.save();
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });


    const project = await Project.findById(task.project);
    if (project) {
      await project.save(); 
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);


    const project = await Project.findById(task.project);
    if (project) {
      project.tasks.pull(task._id);
      await project.save();
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
