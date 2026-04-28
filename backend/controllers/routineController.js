import Routine from "../models/Routine.js";
import Semester from "../models/Semester.js";



export const addRoutine = async (req, res) => {
  try {
    const {
      subject_id,
      day_of_week,
      start_time,
      end_time,
      faculty
    } = req.body;

    // 🔒 Get active semester
    const semester = await Semester.findOne({
      user_id: req.user,
      is_active: true
    });

    if (!semester) {
      return res.status(400).json({ message: "No active semester" });
    }

    // 🔒 Basic validation
    if (!subject_id || !day_of_week) {
      return res.status(400).json({ message: "Subject and day required" });
    }

    // 🔥 Prevent time clash
    const clash = await Routine.findOne({
      user_id: req.user,
      semester_id: semester._id,
      day_of_week,
      start_time: { $lt: end_time },
      end_time: { $gt: start_time }
    });

    if (clash) {
      return res.status(400).json({ message: "Time slot already occupied" });
    }

    const routine = await Routine.create({
      user_id: req.user,
      semester_id: semester._id,
      subject_id,
      day_of_week,
      start_time,
      end_time,
      faculty
    });

    res.json(routine);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getTodayRoutine = async (req, res) => {
  try {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const today = days[new Date().getDay()];

    const semester = await Semester.findOne({
      user_id: req.user,
      is_active: true
    });

    const routines = await Routine.find({
      user_id: req.user,
      semester_id: semester?._id,
      day_of_week: today
    }).populate("subject_id");

    res.json(routines);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllRoutine = async (req, res) => {
  try {
    const semester = await Semester.findOne({
      user_id: req.user,
      is_active: true
    });

    const routines = await Routine.find({
      user_id: req.user,
      semester_id: semester?._id
    })
      .populate("subject_id")
      .sort({ day_of_week: 1, start_time: 1 });

    res.json(routines);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteRoutine = async (req, res) => {
  try {
    const routine = await Routine.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user
    });

    if (!routine) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};