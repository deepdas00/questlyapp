import Semester from "../models/Semester.js";
import Subject from "../models/Subject.js";

// ✅ CREATE NEW SEMESTER (AUTO DEACTIVATE OLD)
export const createSemester = async (req, res) => {
  try {
    const { label, target_percentage, start_date, end_date } = req.body;

    if (!label) {
      return res.status(400).json({ message: "Semester label is required" });
    }

    // 🔒 deactivate old semesters
    await Semester.updateMany({ user_id: req.user }, { is_active: false });

    const semester = await Semester.create({
      user_id: req.user,
      label,
      target_percentage: target_percentage || 75,
      start_date: start_date || null,
      end_date: end_date || null,
      is_active: true,
      is_archived: false,
    });

    res.json(semester);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ACTIVE SEMESTER (WITH AUTO CREATE)
export const getActiveSemester = async (req, res) => {
  try {
    let semester = await Semester.findOne({
      user_id: req.user,
      is_active: true,
    });

    // 🔥 Auto-create default semester
    if (!semester) {
      semester = await Semester.create({
        user_id: req.user,
        label: "Default Semester",
        target_percentage: 0,
        start_date: null,
        end_date: null,
        is_active: true,
        is_archived: false,
      });
    }

    res.json(semester);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE TARGET (SEMESTER LEVEL)
export const updateSemester = async (req, res) => {
  try {
    const { label, target_percentage, start_date, end_date } = req.body;

    if (target_percentage < 50 || target_percentage > 100) {
      return res.status(400).json({ message: "Invalid target range" });
    }

    const semester = await Semester.findOneAndUpdate(
      { user_id: req.user, is_active: true },
      {
        label,
        target_percentage,
        start_date,
        end_date,
      },
      { new: true },
    );

    if (!semester) {
      return res.status(404).json({ message: "Active semester not found" });
    }

    res.json(semester);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ END SEMESTER (SAFE VERSION - ARCHIVE)
export const endSemester = async (req, res) => {
  try {
    const semester = await Semester.findOne({
      user_id: req.user,
      is_active: true,
    });

    if (!semester) {
      return res.status(400).json({ message: "No active semester" });
    }

    semester.is_active = false;
    semester.is_archived = true;

    // 🔥 auto set end date if not provided
    if (!semester.end_date) {
      semester.end_date = new Date();
    }

    await semester.save();

    res.json({
      message: "Semester archived successfully",
      semester,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ⚠️ OPTIONAL: HARD RESET (USE CAREFULLY)
export const resetSemesterData = async (req, res) => {
  try {
    const semester = await Semester.findOne({
      user_id: req.user,
      is_active: true,
    });

    if (!semester) {
      return res.status(400).json({ message: "No active semester" });
    }

    await Subject.updateMany(
      { semester_id: semester._id },
      {
        attended_count: 0,
        conducted_count: 0,
      },
    );

    res.json({ message: "Attendance reset for active semester" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
