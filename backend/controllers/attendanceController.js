import Attendance from "../models/Attendance.js";
import Semester from "../models/Semester.js";
import Routine from "../models/Routine.js";
import Subject from "../models/Subject.js";

/* ===============================
   🔧 HELPER: DATE RANGE
================================ */
const getDayRange = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/* ===============================
   📌 MARK FULL DAY
================================ */
// ✅ PRODUCTION SAFE VERSION

export const markFullDay = async (req, res) => {
  try {
    const { date, type } = req.body;

    const semester = await Semester.findOne({
      user_id: req.user,
      is_active: true,
    });

    if (!semester) {
      return res.status(400).json({ message: "No active semester" });
    }

    const { start, end } = getDayRange(date);

    let attendance = await Attendance.findOne({
      user_id: req.user,
      date: { $gte: start, $lte: end },
    });

    const oldSlots = attendance?.slots || [];

    /* ============================
       🧹 RESET
    ============================ */
    if (type === "RESET") {
      if (attendance) {
        for (let slot of oldSlots) {
          const subject = await Subject.findById(slot.subject_id);
          if (!subject) continue;

          subject.conducted_count -= 1;
          if (slot.status === "PRESENT") subject.attended_count -= 1;

          await subject.save();
        }

        await Attendance.deleteOne({ _id: attendance._id });
      }

      return res.json({ message: "Reset done" });
    }

    /* ============================
       🎉 HOLIDAY (NO COUNTS)
    ============================ */
    if (type === "HOLIDAY") {
      // 🔥 FULL CLEAN (no reverse bug)
      if (attendance) {
        for (let slot of oldSlots) {
          const subject = await Subject.findById(slot.subject_id);
          if (!subject) continue;

          subject.conducted_count -= 1;
          if (slot.status === "PRESENT") subject.attended_count -= 1;

          await subject.save();
        }
      }

      attendance = await Attendance.findOneAndUpdate(
        {
          user_id: req.user,
          date: { $gte: start, $lte: end },
        },
        {
          user_id: req.user,
          semester_id: semester._id,
          date,
          day_type: "HOLIDAY",
          slots: [],
        },
        { upsert: true, new: true }
      );

      return res.json(attendance);
    }

    /* ============================
       📚 NORMAL DAY
    ============================ */

    const day = new Date(date)
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase()
      .slice(0, 3);

    const routines = await Routine.find({
      user_id: req.user,
      semester_id: semester._id,
      day_of_week: day,
    });

    if (routines.length === 0) {
      return res.json({ message: "No classes today" });
    }

    const newStatus = type === "PRESENT" ? "PRESENT" : "ABSENT";

    const newSlots = routines.map((r) => ({
      routine_id: r._id,
      subject_id: r.subject_id,
      status: newStatus,
    }));

    for (let r of routines) {
      const subject = await Subject.findById(r.subject_id);
      if (!subject) continue;

      const old = oldSlots.find(
        (s) => s.routine_id.toString() === r._id.toString()
      );

      // 🆕 NEW ENTRY
      if (!old) {
        subject.conducted_count += 1;
        if (newStatus === "PRESENT") subject.attended_count += 1;
      }

      // 🔄 CHANGE
      else if (old.status !== newStatus) {
        if (old.status === "PRESENT") subject.attended_count -= 1;
        if (newStatus === "PRESENT") subject.attended_count += 1;
      }

      await subject.save();
    }

    attendance = await Attendance.findOneAndUpdate(
      {
        user_id: req.user,
        date: { $gte: start, $lte: end },
      },
      {
        user_id: req.user,
        semester_id: semester._id,
        date,
        day_type: newStatus === "ABSENT" ? "MASS_BUNK" : "NORMAL",
        slots: newSlots,
      },
      { upsert: true, new: true }
    );

    res.json(attendance);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   📌 MARK SINGLE CLASS (SLOT)
================================ */
export const markSubjectAttendance = async (req, res) => {
  try {
    const { date, routine_id, subject_id, status } = req.body;

    const semester = await Semester.findOne({
      user_id: req.user,
      is_active: true,
    });

    if (!semester) {
      return res.status(400).json({ message: "No active semester" });
    }

    const { start, end } = getDayRange(date);

    let attendance = await Attendance.findOne({
      user_id: req.user,
      date: { $gte: start, $lte: end },
    });

    // ❌ BLOCK IF HOLIDAY
    if (attendance?.day_type === "HOLIDAY") {
      return res.status(400).json({
        message: "Holiday hai — reset first",
      });
    }

    // 🆕 CREATE IF NOT EXISTS
    if (!attendance) {
      attendance = await Attendance.create({
        user_id: req.user,
        semester_id: semester._id,
        date,
        day_type: "NORMAL",
        slots: [],
      });
    }

    const subject = await Subject.findById(subject_id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const existing = attendance.slots.find(
      (s) => s.routine_id.toString() === routine_id.toString()
    );

    // 🔄 UPDATE EXISTING
    if (existing) {
      if (existing.status === status) {
        return res.json(attendance); // no change
      }

      // remove old
      if (existing.status === "PRESENT") subject.attended_count -= 1;

      // add new
      if (status === "PRESENT") subject.attended_count += 1;

      existing.status = status;
    }

    // 🆕 NEW SLOT
    else {
      attendance.slots.push({
        routine_id,
        subject_id,
        status,
      });

      subject.conducted_count += 1;

      if (status === "PRESENT") {
        subject.attended_count += 1;
      }
    }

    // 🔥 RECALCULATE DAY TYPE (VERY IMPORTANT)
    const total = attendance.slots.length;
    const present = attendance.slots.filter(
      (s) => s.status === "PRESENT"
    ).length;

    if (total === 0) {
      attendance.day_type = "NORMAL";
    } else if (present === 0) {
      attendance.day_type = "MASS_BUNK";
    } else {
      attendance.day_type = "NORMAL"; // mixed handled in UI
    }

    await attendance.save();
    await subject.save();

    res.json(attendance);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
/* ===============================
   📌 GET ATTENDANCE
================================ */
export const getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find({
      user_id: req.user,
    })
      .populate("slots.subject_id")
      .populate("slots.routine_id");

    res.json(data);
  } catch (err) {
    console.error("GET ATTENDANCE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
