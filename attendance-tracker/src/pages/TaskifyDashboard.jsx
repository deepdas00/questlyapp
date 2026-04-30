import React, { useState, useEffect, useContext } from "react";
import {
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  GraduationCap,
  ChevronDown,
  Flame,
  Target,
  Trash2,
  TrendingUp,
  BarChart3,
  Menu,
  ChevronRight,
  Search,
  Bell,
  X,
  Hash,
  AlignLeft,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
const [loadingId, setLoadingId] = useState(null);
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tempTags, setTempTags] = useState([]);

  // --- DYNAMIC STATE ---
  const [dailyTasks, setDailyTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [expandedTasks, setExpandedTasks] = useState({});

  const [showAllCompleted, setShowAllCompleted] = useState(false);


  const [visibleCount, setVisibleCount] = useState(3);



  const toggleReadMore = (id) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/task");

      const all = res.data;

      // Split by type
      setDailyTasks(all.filter((t) => t.type === "DAILY"));

      console.log(all);

      const assignmentList = all
  .filter((t) => t.type === "ASSIGNMENT")
  .sort((a, b) => {
    const order = {
      TODO: 1,
      IN_PROGRESS: 2,
      COMPLETED: 3,
    };

    return order[a.status] - order[b.status];
  });

setAssignments(assignmentList);


    } catch (err) {
      console.error(err);
    }
  };

  // Form States
  const [dailyForm, setDailyForm] = useState({ title: "", tags: "", note: "" });
  const [newQuest, setNewQuest] = useState({ title: "", deadline: "" });

  const addDaily = async () => {
    if (!dailyForm.title) return;

    let finalTags = [...tempTags];

    if (dailyForm.tags.trim()) {
      const extra = dailyForm.tags
        .split(/[\s,]+/)
        .map((t) => t.trim())
        .filter(Boolean);

      finalTags = [...new Set([...finalTags, ...extra])];
    }

    await API.post("/task", {
      title: dailyForm.title,
      type: "DAILY",
      tags: finalTags,
      note: dailyForm.note,
    });

    setDailyForm({ title: "", tags: "", note: "" });
    setTempTags([]);
    setIsFormOpen(false);

    fetchTasks();
  };

  const handleKeyDown = (e) => {
    if (["Enter", ",", " ", "."].includes(e.key)) {
      e.preventDefault();

      const value = dailyForm.tags.trim();
      if (!value) return;

      // 🔥 Split by space, comma, dot
      const parts = value
        .split(/[\s,\.]+/)
        .map((t) => t.trim())
        .filter(Boolean);

      setTempTags((prev) => [...new Set([...prev, ...parts])]);

      setDailyForm((prev) => ({ ...prev, tags: "" }));
    }
  };

  const deleteTask = async (id) => {
    await API.delete(`/task/${id}`);
    fetchTasks();
  };

  const completeAssignment = async (id) => {
    try {
      await API.put(`/task/toggle/${id}`);
      fetchTasks(); // refresh UI
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDaily = async (id) => {
    await API.put(`/task/toggle/${id}`);
    fetchTasks();
  };








  const addAssignment = async () => {
  if (!newQuest.title) return;

  try {
    await API.post("/task", {
      title: newQuest.title,
      type: "ASSIGNMENT",
      due_date: newQuest.deadline,
      note: newQuest.note,
      progress: 0,
      color: "bg-[#7165E3]",
    });

    setShowQuestModal(false);
    setNewQuest({ title: "", deadline: "" });

    fetchTasks(); // 🔥 IMPORTANT
  } catch (err) {
    console.error(err);
  }
};


const handleComplete = async (id) => {
  try {
    setLoadingId(id); // 🔥 start loading

    await API.put(`/task/toggle/${id}`);

    await fetchTasks();
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingId(null); // 🔥 stop loading
  }
};


const visibleAssignments = assignments.filter((item) => {
  if (item.status !== "COMPLETED") return true;

  return showAllCompleted;
});

  return (
    <div>
      <Navbar />

      <div className="flex min-h-screen bg-[#f0f4f8] text-slate-800 font-sans selection:bg-blue-500/30">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        {/* SIDE NAVIGATION */}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-x-hidden">
          {/* TOP HEADER */}

          <div className="p-3 lg:p-10 space-y-10 max-w-7xl mx-auto">
            {/* WELCOME & QUICK STATS */}
            <section className="relative overflow-hidden rounded-3xl  ">
              {/* Decorative Background Element */}
              <div className="absolute -top-10 -right-10 h-40 w-40 bg-indigo-500/5 blur-[80px] rounded-full" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                {/* Left Side: Typography */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      Overview
                    </span>
                  </div>

                  <h2 className="text-lg md:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                    {getGreeting()},{" "}
                    <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-blue-500 bg-clip-text text-transparent">
                      {user?.name || "Achiever"}
                    </span>{" "}
                    👋
                  </h2>

                  <p className="text-sm md:text-base lg:text-lg text-slate-500 font-medium max-w-md">
                    Stay consistent — your{" "}
                    <span className="text-blue-700 font-bold decoration-[#7165E3]/30 underline underline-offset-4">
                      goals are within reach
                    </span>
                  </p>
                </div>

                {/* Right Side: Stats Grid */}
                <div className="grid grid-cols-2 sm:flex gap-3 md:gap-6 w-full lg:w-auto">
                  <StatCard
                    icon={
                      <Flame className="w-5 h-5 lg:w-6 lg:h-6 text-orange-500" />
                    }
                    val="12"
                    label="Day Streak"
                    className="flex-1 lg:min-w-[140px] bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-orange-200 transition-colors"
                  />
                  <StatCard
                    icon={
                      <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-500" />
                    }
                    val="84%"
                    label="Avg. Score"
                    className="flex-1 lg:min-w-[140px] bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* DUAL SECTION */}
            <div className="grid grid-cols-12 gap-8">
              {/* LEFT: ACADEMIC QUESTS */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">
                    Academic Quests
                  </h3>
                  <button
                    onClick={() => setShowQuestModal(true)}
                    className="bg-[#7165E3] text-white p-2 rounded-xl shadow-lg hover:scale-105 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visibleAssignments.slice(0, visibleCount).map((item) => {
                    const isDone = item.status === "COMPLETED";


                    const isLoading = loadingId === item._id;

                    return (
                      <div
                        key={item._id}
                        className={`bg-white p-6 rounded-[2.5rem] border transition-all ${isLoading ? "opacity-50 pointer-events-none" : ""} ${
                          isDone
                            ? "opacity-60 border-emerald-200"
                            : "border-slate-100 shadow-sm"
                        }`}
                      >
                        <div className="flex justify-between mb-4">
                          <div
                            className={`p-2 rounded-lg ${
                              isDone ? "bg-emerald-500" : item.color
                            } text-white`}
                          >
                            <BookOpen size={16} />
                          </div>

                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                              <Clock size={12} />
                              {isDone
                                ? "COMPLETED"
                                : `Due ${new Date(item.due_date).toLocaleDateString()}`}
                            </span>

                        <button
  onClick={() => handleComplete(item._id)}
  disabled={isLoading}
  className={`mt-2 text-[10px] font-black px-2 py-1 rounded transition-all
  ${
    isDone
      ? "bg-emerald-100 text-emerald-600"
      : "bg-indigo-50 text-[#7165E3]"
  }`}
>
  {isLoading ? "Updating..." : isDone ? "UNDO" : "COMPLETE"}
</button>
                          </div>
                        </div>

                        

                        <h4
                          className={`font-bold text-slate-800 text-lg mb-6 ${
                            isDone ? "line-through" : ""
                          }`}
                        >
                          {item.title}
                        </h4>


{item.note && (
  <p className="text-sm text-slate-500 mt-2 break-words">
    {item.note}
  </p>
)}


                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] font-black uppercase">
                            <span className="text-slate-400">Progress</span>
                            <span
                              className={
                                isDone ? "text-emerald-500" : "text-[#7165E3]"
                              }
                            >
                              {item.progress}%
                            </span>
                          </div>

                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${
                                isDone ? "bg-emerald-500" : item.color
                              }`}
                              style={{ width: `${item.progress}%` }}
                            />


                            
                          </div>


                          {!isDone && (
  <input
  type="range"
  min="0"
  max="100"
  value={item.progress}
  onChange={(e) => {
    // 🔥 ONLY UI UPDATE (instant)
    const newVal = Number(e.target.value);

    setAssignments((prev) =>
      prev.map((t) =>
        t._id === item._id ? { ...t, progress: newVal } : t
      )
    );
  }}
  onMouseUp={async (e) => {
    // 🔥 API CALL ONLY ON RELEASE
    await API.put(`/task/progress/${item._id}`, {
      progress: Number(e.target.value),
    });
    fetchTasks();
  }}
  className="w-full mt-3 accent-indigo-500"
/>
)}


                        </div>
                      </div>
                    );
                  })}



                  {visibleCount < visibleAssignments.length && (
  <div className="col-span-2 text-center mt-4">
    <button
      onClick={() => setVisibleCount((prev) => prev + 3)}
      className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition"
    >
      Show More
    </button>
  </div>
)}




                  {assignments.some((a) => a.status === "COMPLETED") && (
  <div className="text-center mt-4">
    <button
      onClick={() => setShowAllCompleted(!showAllCompleted)}
      className="text-xs font-bold text-indigo-600"
    >
      {showAllCompleted ? "Show Less" : "Show Completed"}
    </button>
  </div>
)}
                </div>

                {/* DAILY HUSTLE (Updated Add Section) */}
                <div className="mt-10">
                  {/* IMPACTFUL ADD FORM */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-900">
                        Today's Hustle
                      </h3>
                      <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className={`p-2 rounded-xl transition-all ${isFormOpen ? "bg-red-100 text-red-500 rotate-45" : "bg-[#7165E3] text-white"}`}
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    {isFormOpen && (
                      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Headline */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                              Task Headline
                            </label>
                            <input
                              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                              placeholder="e.g. Physics Lab Report"
                              value={dailyForm.title}
                              onChange={(e) =>
                                setDailyForm({
                                  ...dailyForm,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Keywords with Pills */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                              Keywords (Press Comma to separate)
                            </label>
                            <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-xl min-h-[44px]">
                              {tempTags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="flex items-center gap-1 bg-white border border-indigo-100 text-[#7165E3] text-[10px] font-bold px-2 py-1 rounded-lg"
                                >
                                  {tag}
                                  <X
                                    size={10}
                                    className="cursor-pointer"
                                    onClick={() =>
                                      setTempTags(
                                        tempTags.filter((_, idx) => idx !== i),
                                      )
                                    }
                                  />
                                </span>
                              ))}
                              <input
                                className="flex-1 bg-transparent border-none text-sm outline-none min-w-[100px]"
                                placeholder={
                                  tempTags.length === 0 ? "Urgent, Exam..." : ""
                                }
                                value={dailyForm.tags}
                                onKeyDown={handleKeyDown}
                                onChange={(e) =>
                                  setDailyForm({
                                    ...dailyForm,
                                    tags: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>

                        {/* Description & Add Button */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                            Key Points / Description
                          </label>
                          <div className="flex gap-3">
                            <input
                              className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                              placeholder="Write down the important details..."
                              value={dailyForm.note}
                              onChange={(e) =>
                                setDailyForm({
                                  ...dailyForm,
                                  note: e.target.value,
                                })
                              }
                            />
                            <button
                              onClick={addDaily}
                              className="bg-[#7165E3] hover:bg-[#5b51c5] text-white px-6 rounded-xl font-black text-xs transition-all shadow-lg shadow-indigo-100"
                            >
                              ADD TASK
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {dailyTasks.map((task) => {
                      const isExpanded = expandedTasks[task._id];
                      const isDone = task.status === "DONE";

                      // Smart logic for UI states
                      const needsToggle =
                        task.title?.length > 40 ||
                        task.note?.length > 120 ||
                        (task.tags || []).join("").length > 50;

                      return (
                        <div
                          key={task._id}
                          className={`group relative overflow-hidden rounded-[24px] border transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 ${
                            isDone
                              ? "bg-emerald-50/30 border-emerald-100/60 shadow-none"
                              : "bg-white border-slate-100 shadow-sm"
                          }`}
                        >
                          {/* Progress highlight for done tasks */}
                          {isDone && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/50" />
                          )}

                          <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            {/* ✅ STATUS & TITLE SECTION */}
                            <div className="flex gap-4 items-center flex-1 min-w-0 w-full">
                              <button
                                onClick={() => toggleDaily(task._id)}
                                className={`relative flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 transform active:scale-90 ${
                                  isDone
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                                    : "bg-slate-50 border border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-500"
                                }`}
                              >
                                <CheckCircle2
                                  size={20}
                                  className={
                                    isDone
                                      ? "scale-100"
                                      : "scale-75 opacity-0 group-hover:opacity-100"
                                  }
                                />
                                {!isDone && (
                                  <div className="absolute w-2 h-2 rounded-full bg-slate-300" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`text-base sm:text-lg font-bold tracking-tight transition-all duration-300 ${
                                    isDone
                                      ? "text-slate-400 line-through"
                                      : "text-slate-800"
                                  } ${!isExpanded ? "truncate" : "break-words"}`}
                                >
                                  {task.title}
                                </h4>

                                {/* Optional dynamic timestamp or priority badge could go here */}
                              </div>
                            </div>

                            {/* ✅ ACTIONS SECTION (Responsive behavior) */}
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end sm:border-l sm:border-slate-100 sm:pl-6">
                              {needsToggle && (
                                <button
                                  onClick={() => toggleReadMore(task._id)}
                                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                >
                                  {isExpanded ? "Less" : "Details"}
                                </button>
                              )}

                              <button
                                onClick={() => deleteTask(task._id)}
                                className="p-2 rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>

                          {/* ✅ EXPANDABLE DETAILS AREA */}
                          <div
                            className={`transition-all duration-500 ease-in-out px-4 sm:px-6 overflow-hidden ${
                              isExpanded
                                ? "max-h-[500px] pb-6 opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="pt-2 space-y-4 border-t border-slate-50">
                              {task.note && (
                                <p className="text-sm sm:text-base text-slate-500 leading-relaxed italic break-words overflow-wrap-anywhere ">
                                  {task.note}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-2">
                                {(task.tags?.length
                                  ? task.tags
                                  : ["General"]
                                ).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 text-[11px] font-extrabold rounded-lg bg-indigo-50/50 text-indigo-600 border border-indigo-100/50 uppercase tracking-wider  break-all max-w-full inline-block"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (Performance) */}
              <div className="col-span-12 lg:col-span-4 space-y-8">
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-lg font-black mb-1">Study Insight</h3>
                    <p className="text-xs text-slate-400 font-bold mb-8 uppercase tracking-widest">
                      Focus Hours
                    </p>
                    <div className="flex items-end justify-between h-32 gap-2 mb-6">
                      {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-indigo-50 rounded-t-lg hover:bg-[#7165E3] transition-colors"
                          style={{ height: `${h}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#7165E3] to-[#8B5CF6] p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-100">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <BarChart3 size={24} />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black opacity-60 uppercase tracking-widest italic">
                        Academic Streak
                      </p>
                      <p className="text-2xl font-black">14 Days</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold mb-2 uppercase">
                    Ready for Exams?
                  </h4>
                  <p className="text-xs opacity-70 mb-6">
                    You've completed 80% of your current academic quests.
                  </p>
                  <button className="w-full py-4 bg-white text-[#7165E3] rounded-2xl font-black text-[11px] uppercase tracking-widest">
                    View Rankings
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MODAL FOR ADDING QUESTS */}
          {showQuestModal && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black">New Academic Quest</h3>
                  <button onClick={() => setShowQuestModal(false)}>
                    <X className="text-slate-300" />
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none"
                    placeholder="Assignment Title"
                    value={newQuest.title}
                    onChange={(e) =>
                      setNewQuest({ ...newQuest, title: e.target.value })
                    }
                  />
                  <textarea
  className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
  placeholder="Description..."
  value={newQuest.note}
  onChange={(e) =>
    setNewQuest({ ...newQuest, note: e.target.value })
  }
/>
                  <input
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none"
                    type="date"
                    value={newQuest.deadline}
                    onChange={(e) =>
                      setNewQuest({ ...newQuest, deadline: e.target.value })
                    }
                  />
                  <button
  onClick={addAssignment}
  className="w-full py-4 bg-[#7165E3] text-white rounded-2xl font-black shadow-xl"
>
  ADD TO LIST
</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div
    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${active ? "bg-[#7165E3] text-white shadow-lg shadow-indigo-100" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}`}
  >
    {icon}
    <span className="font-bold text-sm">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto" />}
  </div>
);

const StatCard = ({ icon, val, label }) => (
  <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
    <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-lg font-black text-slate-900 leading-none">{val}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
        {label}
      </p>
    </div>
  </div>
);

export default StudentDashboard;
