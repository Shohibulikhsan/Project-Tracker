const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'In Progress', 'Done'], default: 'Draft' },
  completionProgress: { type: Number, default: 0 },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] 
});

ProjectSchema.pre('save', async function (next) {
  const project = this;

  if (project.tasks && project.tasks.length > 0) {
    const Task = mongoose.model('Task');
    const tasks = await Task.find({ _id: { $in: project.tasks } });

    let totalWeight = 0;
    let completedWeight = 0;

    tasks.forEach((task) => {
      totalWeight += task.weight;
      if (task.status === 'Done') {
        completedWeight += task.weight;
      }
    });

    project.completionProgress = totalWeight ? (completedWeight / totalWeight) * 100 : 0;

    const allDraft = tasks.every(task => task.status === 'Draft');
    const anyInProgress = tasks.some(task => task.status === 'In Progress');
    const allDone = tasks.every(task => task.status === 'Done');

    if (allDraft) {
      project.status = 'Draft';
    } else if (anyInProgress) {
      project.status = 'In Progress';
    } else if (allDone) {
      project.status = 'Done';
    }
  }

  next();
});

const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;
