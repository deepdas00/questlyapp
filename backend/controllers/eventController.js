import Event from "../models/Event.js";

// ➕ CREATE EVENT
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      isAllDay,
      startTime,
      endTime,
      type,
      priority,
      color,
      reminder,
      recurrence,
      location,
    } = req.body;

    // ✅ Validate required fields
    if (!title || !startDate) {
      return res.status(400).json({
        message: "Title and startDate are required",
      });
    }

    // ✅ Validate user
    const userId =
      req.user?.id || req.user?._id || req.user?.userId || req.user;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // ✅ Validate date
    const parsedStart = new Date(startDate);
    if (isNaN(parsedStart)) {
      return res.status(400).json({
        message: "Invalid start date",
      });
    }

    if (endDate && new Date(endDate) < parsedStart) {
      return res.status(400).json({
        message: "End date cannot be before start date",
      });
    }

    const event = await Event.create({
      userId: req.user?.id || req.user?._id || req.user?.userId || req.user,
      title,
      description,
      startDate: parsedStart,
      endDate,
      isAllDay,
      startTime,
      endTime,
      type,
      priority,
      color,
      reminder,
      recurrence,
      location,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("CREATE EVENT ERROR:", err);
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

// 📥 GET EVENTS
export const getEvents = async (req, res) => {
  try {  
    // ✅ Validate user
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { start, end } = req.query;

    const query = {
      userId: req.user?.id || req.user?._id || req.user?.userId || req.user,
      isDeleted: false,
    };

    // ✅ Date range filter
    if (start && end) {
      query.startDate = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const events = await Event.find(query).sort({ startDate: 1 });

    res.json(events);
  } catch (err) {
    console.error("GET EVENTS ERROR:", err);
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

// ✏️ UPDATE EVENT
export const updateEvent = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // ✅ Prevent dangerous updates
    const updates = { ...req.body };
    delete updates.userId;
    delete updates.isDeleted;

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true },
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json(event);
  } catch (err) {
    console.error("UPDATE EVENT ERROR:", err);
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

// 🗑️ DELETE EVENT (Soft Delete)
export const deleteEvent = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isDeleted: true },
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("DELETE EVENT ERROR:", err);
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

// ✅ TOGGLE COMPLETE
export const toggleComplete = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user?.id || req.user?._id || req.user?.userId || req.user,
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    event.isCompleted = !event.isCompleted;
    await event.save();

    res.json(event);
  } catch (err) {
    console.error("TOGGLE EVENT ERROR:", err);
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};
