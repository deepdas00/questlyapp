import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import {
  Plus,
  X,
  Calendar as CalIcon,
  LayoutGrid,
  Zap,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import API from "../utils/api";
import { useApp } from "../context/AppContext";
import "react-calendar/dist/Calendar.css";
import { createPortal } from "react-dom";

const EventCalendar = () => {
  const { events, setEvents, eventsLoaded, setEventsLoaded } = useApp();
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "personal",
    priority: "medium",
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    recurrence: "none",
    isAllDay: true,
  });

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-[6px] border-l-rose-500 bg-white/80 hover:bg-rose-50/50 text-rose-700 shadow-sm";
      case "medium":
        return "border-l-[6px] border-l-amber-500 bg-white/80 hover:bg-amber-50/50 text-amber-700 shadow-sm";
      case "low":
        return "border-l-[6px] border-l-emerald-500 bg-white/80 hover:bg-emerald-50/50 text-emerald-700 shadow-sm";
      default:
        return "border-l-[6px] border-l-slate-300 bg-white/80 text-slate-600";
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/event", { withCredentials: true });
        setEvents(res.data);
        setEventsLoaded(true);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    if (!eventsLoaded) fetchEvents();
  }, [eventsLoaded, setEvents, setEventsLoaded]);

  const handleSave = async () => {
    if (!form.title) return;
    const payload = { ...form, startDate: date };
    try {
      if (editingId) {
        const res = await API.put(`/event/${editingId}`, payload, {
          withCredentials: true,
        });
        setEvents((prev) =>
          prev.map((e) => (e._id === editingId ? res.data : e)),
        );
      } else {
        const res = await API.post("/event", payload, {
          withCredentials: true,
        });
        setEvents((prev) => [...prev, res.data]);
      }
      closeModal();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await API.delete(`/event/${id}`, { withCredentials: true });
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openEditModal = (event) => {
    setEditingId(event._id);
    setForm({ ...event, description: event.description || "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      type: "personal",
      priority: "medium",
      startTime: "09:00",
      endTime: "10:00",
      location: "",
      recurrence: "none",
      isAllDay: true,
    });
  };

  const getEventsForDate = (d) => {
    return events.filter(
      (e) => new Date(e.startDate).toDateString() === d.toDateString(),
    );
  };

  return (
    <div className="w-full h-full min-h-[85vh] flex flex-col bg-slate-50/40 backdrop-blur-3xl border border-white/80 rounded-[1.3rem] lg:rounded-[3rem] py-3 p-2 md:p-5 shadow-2xl transition-all duration-500">
      {/* HEADER: Dynamic & Responsive */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-5 px-2 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 md:w-10 md:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Zap size={12} className="text-white fill-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">
              Event Calendar
            </h2>
          </div>
          {/* <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2 ml-1">Universal Command Center</p> */}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-1 gap-8 flex-1">
        {/* LEFT COLUMN: Calendar Card */}
        <div className="xl:col-span-7 p-1 flex flex-col">
          <div className="bg-white/80 rounded-[2.5rem] p-2 md:p-8 shadow-xl shadow-slate-200/40 border border-white h-full">
            <style>{`
      .react-calendar { border: none !important; width: 100% !important; background: transparent !important; }
      .react-calendar__tile { padding: 1.5em 0.5em; font-weight: 800; border-radius: 18px; transition: 0.3s; font-size: 0.9rem; color: #1e293b; }
      
      /* Standard Hover */
      .react-calendar__tile:hover:not(.react-calendar__month-view__days__day--neighboringMonth) { background: #f8fafc !important; transform: translateY(-2px); }
      
      .react-calendar__tile--active { background: #4f46e5 !important; color: white !important; box-shadow: 0 12px 24px -6px rgba(79, 70, 229, 0.5); }
      .react-calendar__tile--now { background: #e0e7ff !important; color: #4338ca !important; }
      
      /* Neighboring Month Styles: No Background, Blurred, and Disabled */
      .react-calendar__month-view__days__day--neighboringMonth { 
        background: none !important; /* Removes background color */
        color: #cbd5e1 !important;   /* Makes the text lighter/softer */          /* Applies the blur */
        pointer-events: none;        /* Disables clicking */
        cursor: default;
      }

      .react-calendar__navigation { margin-bottom: 2rem; }
      .react-calendar__navigation button { font-weight: 900; color: #0f172a; font-size: 1.1rem; border-radius: 12px; }
      .react-calendar__navigation button:hover { background: #f1f5f9 !important; }
      .react-calendar__month-view__weekdays__weekday { text-decoration: none; font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; padding-bottom: 1rem; }
      abbr[title] { text-decoration: none; }
    `}</style>

            <Calendar
              value={date}
              onChange={setDate}
              tileDisabled={({ activeStartDate, date: tileDate, view }) =>
                view === "month" &&
                tileDate.getMonth() !== activeStartDate.getMonth()
              }
              tileContent={({ date: tileDate }) => {
                // Dot logic remains for current month only
                const isCurrentMonth = tileDate.getMonth() === date.getMonth();
                return (
                  isCurrentMonth &&
                  getEventsForDate(tileDate).length > 0 && (
                    <div className="flex justify-center mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    </div>
                  )
                );
              }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Timeline/Agenda */}
        <div className="xl:col-span-7 flex flex-col h-full p-1 overflow-hidden ">
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Plus size={18} />
              <span className="text-xs font-black uppercase tracking-wider">
                Add Event
              </span>
            </button>
          </div>

          <div className="h-full flex flex-col">
            <div className="flex pt-4 justify-between items-center mb-6">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Daily Briefing
              </h3>
              <div className="bg-indigo-50 px-3 py-1 rounded-full">
                <span className="text-[10px] font-bold text-indigo-600">
                  {getEventsForDate(date).length} tasks
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto  custom-scrollbar space-y-4">
              {getEventsForDate(date).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <CalIcon size={48} className="text-slate-300 mb-4" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Clear Agenda
                  </p>
                </div>
              ) : (
                getEventsForDate(date).map((e) => (
                  <div
                    key={e._id}
                    className={`group p-4 rounded-[2rem] border border-white transition-all duration-300 hover:shadow-lg ${getPriorityStyles(e.priority)}`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-white rounded shadow-sm">
                            {e.type}
                          </span>
                          {!e.isAllDay && (
                            <span className="text-[9px] font-black opacity-60 flex items-center gap-1">
                              <Clock size={10} /> {e.startTime}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditModal(e)}
                            className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(e._id)}
                            className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-[15px] leading-tight">
                          {e.title}
                        </h4>
                        {e.description && (
                          <div className="mt-2">
                            <p
                              className={`text-xs text-slate-500 leading-relaxed font-medium ${expandedEvent === e._id ? "" : "line-clamp-2"}`}
                            >
                              {e.description}
                            </p>
                            {e.description.length > 40 && (
                              <button
                                onClick={() =>
                                  setExpandedEvent(
                                    expandedEvent === e._id ? null : e._id,
                                  )
                                }
                                className="text-[9px] font-black text-indigo-500 mt-2 uppercase tracking-tighter hover:underline"
                              >
                                {expandedEvent === e._id
                                  ? "Show less"
                                  : "Read more"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {e.location && (
                        <div className="flex items-center gap-1.5 text-slate-400 pt-2 border-t border-slate-100/50">
                          <MapPin size={11} />
                          <span className="text-[10px] font-bold truncate uppercase">
                            {e.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Fixed Centered */}
      {showModal &&
        createPortal(
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen flex items-end sm:items-center justify-center z-[99999] isolation-auto">
            {/* 1. Backdrop */}
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={closeModal}
            />

            {/* 2. Modal Container */}
            <div
              className="relative bg-white w-full sm:max-w-xl md:max-w-2xl 
                    h-[92%] sm:h-auto sm:max-h-[85vh] 
                    rounded-t-[2rem] sm:rounded-[2.5rem] 
                    shadow-2xl flex flex-col overflow-hidden 
                    animate-in slide-in-from-bottom duration-300 sm:zoom-in-95"
            >
              {/* Mobile-only Grab Handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>

              {/* Header - Compact on mobile, spacious on desktop */}
              <div className="flex justify-between items-center px-3 py-3 sm:p-8 border-b border-slate-50">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-none">
                  {editingId ? "Edit Event" : "New Event"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2.5 bg-slate-100 rounded-full text-slate-500 active:scale-90 transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto px-3 py-4 sm:p-8 space-y-6 custom-scrollbar pb-32 sm:pb-8">
                {/* Large Input for Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    Title
                  </label>
                  <input
                    autoFocus
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Event name..."
                    className="w-full bg-slate-50 rounded-2xl p-3 text-md font-bold border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                {/* Description - Auto-growing height is better for mobile */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Add details..."
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none h-24 resize-none transition-all"
                  />
                </div>

                {/* Two-Column Layout (Stacks on Mobile) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Selection - Large buttons style */}
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Category
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["college", "exam", "personal", "meeting"].map(
                        (type) => (
                          <button
                            key={type}
                            onClick={() => setForm({ ...form, type })}
                            className={`py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border-2 
                    ${
                      form.type === type
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                        : "bg-white border-slate-100 text-slate-600"
                    }`}
                          >
                            {type}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Time & All Day Toggle */}
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        All Day
                      </label>
                      <input
                        type="checkbox"
                        checked={form.isAllDay}
                        onChange={(e) =>
                          setForm({ ...form, isAllDay: e.target.checked })
                        }
                        className="w-6 h-6 accent-indigo-600"
                      />
                    </div>

                    {!form.isAllDay && (
                      <div className="flex gap-2">
                        <input
                          type="time"
                          value={form.startTime}
                          onChange={(e) =>
                            setForm({ ...form, startTime: e.target.value })
                          }
                          className="flex-1 p-2 rounded-xl text-xs font-bold bg-white border border-slate-100"
                        />
                        <input
                          type="time"
                          value={form.endTime}
                          onChange={(e) =>
                            setForm({ ...form, endTime: e.target.value })
                          }
                          className="flex-1 p-2 rounded-xl text-xs font-bold bg-white border border-slate-100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Location - Full Width */}
                <div className="relative mb-7">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      placeholder="Add location"
                      className="w-full bg-slate-50 rounded-2xl p-4 pl-12 text-sm font-bold border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Footer - Floating over content on mobile for easy reach */}
              <div className="absolute bottom-0 left-0 right-0 p-4 pb bg-gradient-to-t from-white via-white to-transparent sm:static sm:bg-none sm:p-8 pb-17">
                <button
                  onClick={handleSave}
                  className="w-full bg-indigo-600 text-white font-black py-3 sm:py-5 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                >
                  {editingId ? "Update Event" : "Create Event"}
                  <CheckCircle2 size={20} />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default EventCalendar;
