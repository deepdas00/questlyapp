import Task from "../models/Task.js";

/* ===============================
   📌 CREATE TASK
================================ */
export const createTask = async (req, res) => {
  try {
    const { title, type, category, tags, note, due_date, points } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: "Title and type required" });
    }

    const task = await Task.create({
      user_id: req.user,
      title,
      type,
      category,
      tags,
      note,
      due_date,
      points: Number(points) || 50,
      status: type === "ASSIGNMENT" ? "IN_PROGRESS" : "TODO"
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ===============================
   📌 GET ALL TASKS (FILTER OPTIONAL)
================================ */
export const getTasks = async (req, res) => {
  try {
    const { type } = req.query;

    const query = { user_id: req.user };
    if (type) query.type = type;

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ===============================
   📌 GET SINGLE TASK
================================ */
export const getSingleTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user_id: req.user
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ===============================
   📌 TOGGLE TASK
================================ */
export const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user_id: req.user
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

   if (task.type === "DAILY") {
  if (task.status === "DONE") {
    task.status = "TODO";
    task.completedAt = null;
  } else {
    task.status = "DONE";
    task.completedAt = new Date(); // 🔥 ADD THIS
  }
}

  if (task.type === "ASSIGNMENT") {
  if (task.status === "COMPLETED") {
    // 🔄 Undo
    task.status = "IN_PROGRESS";
    task.progress = 0;
    task.completedAt = null; // ❌ remove completion time
  } else {
    // ✅ Mark complete
    task.status = "COMPLETED";
    task.progress = 100;
    task.completedAt = new Date(); // 🔥 SAVE TIME
  }
}

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ===============================
   📌 UPDATE TASK STATUS (KANBAN)
================================ */
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user_id: req.user
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ===============================
   📌 UPDATE PROGRESS (ASSIGNMENT)
================================ */
export const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user_id: req.user
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.progress = progress;

   if (progress === 100) {
  task.status = "COMPLETED";
  task.completedAt = new Date(); // 🔥 ADD
} else if (progress > 0) {
  task.status = "IN_PROGRESS";
  task.completedAt = null; // optional but clean
}

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ===============================
   📌 DELETE TASK
================================ */
export const deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ===============================
   📊 TASK STATS
================================ */
export const getTaskStats = async (req, res) => {
  try {
    const tasks = await Task.find({ user_id: req.user });

    const totalTasks = tasks.length;

    const completedDaily = tasks.filter(
      t => t.type === "DAILY" && t.status === "DONE"
    ).length;

    const completedAssignments = tasks.filter(
      t => t.type === "ASSIGNMENT" && t.status === "COMPLETED"
    ).length;

    const totalXP = tasks
      .filter(t => t.status === "DONE" || t.status === "COMPLETED")
      .reduce((sum, t) => sum + t.points, 0);

    const avgProgress =
      tasks.filter(t => t.type === "ASSIGNMENT").length === 0
        ? 0
        : Math.round(
            tasks
              .filter(t => t.type === "ASSIGNMENT")
              .reduce((sum, t) => sum + (t.progress || 0), 0) /
              tasks.filter(t => t.type === "ASSIGNMENT").length
          );

    res.json({
      totalTasks,
      completedDaily,
      completedAssignments,
      totalXP,
      avgProgress
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};