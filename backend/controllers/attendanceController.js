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

    // 🔍 Find existing attendance
    let attendance = await Attendance.findOne({
      user_id: req.user,
      date: { $gte: start, $lte: end },
    });

    const oldSlots = attendance?.slots || [];

    

    /* ===============================
       🔄 RESET DAY (FULL CLEAR)
    =============================== */
    if (type === "RESET") {
      if (!attendance) {
        return res.json({ message: "Already reset ✅" });
      }

      // Reverse counts
      for (let slot of oldSlots) {
        const subject = await Subject.findById(slot.subject_id);
        if (!subject) continue;

        subject.conducted_count -= 1;

        if (slot.status === "PRESENT") {
          subject.attended_count -= 1;
        }

        // Safety
        if (subject.conducted_count < 0) subject.conducted_count = 0;
        if (subject.attended_count < 0) subject.attended_count = 0;

        await subject.save();
      }

      // Delete attendance (clean reset)
      await Attendance.deleteOne({ _id: attendance._id });

      return res.json({ message: "Day reset successfully ✅" });
    }

    /* ===============================
       🎉 HOLIDAY (REVERSE + EMPTY)
    =============================== */
    if (type === "HOLIDAY") {
      if (attendance && oldSlots.length > 0) {
        for (let slot of oldSlots) {
          const subject = await Subject.findById(slot.subject_id);
          if (!subject) continue;

          subject.conducted_count -= 1;

          if (slot.status === "PRESENT") {
            subject.attended_count -= 1;
          }

          // Safety
          if (subject.conducted_count < 0) subject.conducted_count = 0;
          if (subject.attended_count < 0) subject.attended_count = 0;

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
        { upsert: true, returnDocument: "after" }
      );

      return res.json(attendance);
    }

    /* ===============================
       📚 PRESENT / ABSENT
    =============================== */

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
      return res.json({ message: "No classes today 🚫" });
    }

    const newStatus = type === "PRESENT" ? "PRESENT" : "ABSENT";

    const newSlots = routines.map((r) => ({
      routine_id: r._id,
      subject_id: r.subject_id,
      status: newStatus,
    }));

    // 🔁 Update subject counts correctly
    for (let r of routines) {
      const subject = await Subject.findById(r.subject_id);
      if (!subject) continue;

      const old = oldSlots.find(
        (s) => s.routine_id.toString() === r._id.toString()
      );

      if (!old) {
        // New entry
        subject.conducted_count += 1;

        if (newStatus === "PRESENT") {
          subject.attended_count += 1;
        }
      } else if (old.status !== newStatus) {
        // Status change
        if (old.status === "PRESENT") {
          subject.attended_count -= 1;
        }

        if (newStatus === "PRESENT") {
          subject.attended_count += 1;
        }
      }

      // Safety
      if (subject.conducted_count < 0) subject.conducted_count = 0;
      if (subject.attended_count < 0) subject.attended_count = 0;

      await subject.save();
    }

    // 💾 Save attendance
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
      { upsert: true, returnDocument: "after" }
    );

    res.json(attendance);

  } catch (err) {
    console.error("MARK FULL DAY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   📌 MARK SINGLE CLASS (SLOT)
================================ */
export const markSubjectAttendance = async (req, res) => {
  try {
    const { date, routine_id, subject_id, status } = req.body;

    if (!routine_id || !subject_id || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const semester = await Semester.findOne({
      user_id: req.user,
      is_active: true,
    });

    if (!semester) {
      return res.status(400).json({ message: "No active semester" });
    }

    const { start, end } = getDayRange(date);

    // 🔍 Find attendance for the day
    let attendance = await Attendance.findOne({
      user_id: req.user,
      date: { $gte: start, $lte: end },
    });

    // 🆕 Create if not exists
    if (!attendance) {
      attendance = await Attendance.create({
        user_id: req.user,
        semester_id: semester._id,
        date,
        slots: [],
      });
    }

    if (!attendance.slots) {
      attendance.slots = [];
    }

    // 🔍 Find existing slot
    const existing = attendance.slots.find(
      (s) => s.routine_id?.toString() === routine_id?.toString()
    );

    const subject = await Subject.findById(subject_id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (existing) {
      // ⚡ CASE: UPDATE EXISTING SLOT

      // If same status → do nothing
      if (existing.status === status) {
        return res.json(attendance);
      }

      // Adjust attended count
      if (existing.status === "PRESENT") {
        subject.attended_count -= 1;
      }

      if (status === "PRESENT") {
        subject.attended_count += 1;
      }

      // Update status
      existing.status = status;

    } else {
      // 🆕 CASE: NEW SLOT

      attendance.slots.push({
        routine_id,
        subject_id,
        status,
      });

      // Increment conducted
      subject.conducted_count += 1;

      // Increment attended if present
      if (status === "PRESENT") {
        subject.attended_count += 1;
      }
    }

    await attendance.save();
    await subject.save();

    res.json(attendance);

  } catch (err) {
    console.error("MARK SUBJECT ERROR:", err);
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
