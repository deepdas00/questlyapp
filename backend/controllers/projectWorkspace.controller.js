import ProjectWorkspace from "../models/ProjectWorkspace.js";

// ✅ Create Project
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await ProjectWorkspace.create({
      name,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "admin" }]
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get All Projects of User
export const getUserProjects = async (req, res) => {
  try {
    const projects = await ProjectWorkspace.find({
      "members.user": req.user._id
    }).populate("members.user", "name email");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Single Project
export const getSingleProject = async (req, res) => {
  try {
    const project = await ProjectWorkspace.findById(req.params.id)
      .populate("members.user", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Project (Only Owner)
export const deleteProject = async (req, res) => {
  try {
    const project = await ProjectWorkspace.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};