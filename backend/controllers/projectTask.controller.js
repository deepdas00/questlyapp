import ProjectTask from "../models/ProjectTask.js";

// ✅ Create Task
export const createProjectTask = async (req, res) => {
  try {
    const task = await ProjectTask.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Tasks by Project
export const getProjectTasks = async (req, res) => {
  try {
    const tasks = await ProjectTask.find({
      project: req.params.projectId
    }).populate("assignedTo", "name email");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Task
export const updateProjectTask = async (req, res) => {
  try {
    const task = await ProjectTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Task
export const deleteProjectTask = async (req, res) => {
  try {
    await ProjectTask.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};