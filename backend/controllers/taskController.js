import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  const { title, description, assignedTo, team } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      assignedTo,
      team
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasksByTeam = async (req, res) => {
  try {
    const tasks = await Task.find({ team: req.params.teamId }).populate('assignedTo', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
