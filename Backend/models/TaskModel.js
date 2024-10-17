const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'In Progress', 'Done'], default: 'Draft' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  weight: { type: Number, required: true } 
});

taskSchema.post('save', async function (task, next) {
  const Project = mongoose.model('Project');
  const project = await Project.findById(task.project);

  if (project) {
    await project.save(); 
  }

  next();
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
