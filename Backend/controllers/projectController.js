const Project = require('../models/ProjectModel');

const createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('tasks');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProject,
    getProjects,
    updateProject,
    deleteProject
};
