import Subject from "../models/Subject.js";
import Semester from "../models/Semester.js";


// 🔥 ADD SUBJECT
export const addSubject = async (req, res) => {
  try {
    const { name, code, faculty } = req.body;

    const semester = await Semester.findOne({
      user_id: req.user,
      is_active: true
    });

    if (!semester) {
      return res.status(400).json({ message: "No active semester" });
    }

    const subject = await Subject.create({
      user_id: req.user,
      semester_id: semester._id,
      name,
      code,
      faculty
    });

    res.json(subject);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 GET SUBJECTS
export const getSubjects = async (req, res) => {
  try {
    const semester = await Semester.findOne({
      user_id: req.user,
      is_active: true
    });

    const subjects = await Subject.find({
      user_id: req.user,
      semester_id: semester?._id
    });

    res.json(subjects);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 DELETE SUBJECT
export const deleteSubject = async (req, res) => {
  try {
    await Subject.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user
    });

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 UPDATE SUBJECT
export const updateSubject = async (req, res) => {
  try {
    const { name, code, faculty } = req.body;

    // 🔒 Validate
    if (!name) {
      return res.status(400).json({ message: "Subject name is required" });
    }

    const subject = await Subject.findOneAndUpdate(
      {
        _id: req.params.id,
        user_id: req.user
      },
      {
        name,
        code,
        faculty
      },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json(subject);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};