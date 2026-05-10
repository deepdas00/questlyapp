import React, { useState,useMemo, useEffect, useContext } from "react";
import {
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  GraduationCap,
  ChevronDown,
  Flame,
  PlusCircle,
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
import {
  LineChart,
  Line,
  XAxis,
  AreaChart,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useApp } from "../context/AppContext";


const StudentDashboard = () => {
  const { tasks, setTasks } = useApp();

  // 🔥 AFTER states
const allDailyTasks = tasks?.filter(t => t.type === "DAILY") || [];
const assignments = tasks?.filter(t => t.type === "ASSIGNMENT") || [];



  const [adding, setAdding] = useState(false);
  const { user } = useContext(AuthContext);
  const [hustleView, setHustleView] = useState("TODAY");
  const [dailyVisible, setDailyVisible] = useState(5);

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
  // const [allDailyTasks, setAllDailyTasks] = useState([]);
  // const [dailyTasks, setDailyTasks] = useState([]);
  // const [assignments, setAssignments] = useState([]);





  const [expandedTasks, setExpandedTasks] = useState({});

  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [dailyQuote, setDailyQuote] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  const activeTasks = assignments.filter((t) => t.status !== "COMPLETED");
  const [completedCount, setCompletedCount] = useState(2);

  const paginatedActive = activeTasks.slice(0, visibleCount);
  const [addingQuest, setAddingQuest] = useState(false);





  const toggleReadMore = (id) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

useEffect(() => {
  fetchTasks();
}, []);




  const dailyTasks = useMemo(() => {
  if (!tasks) return [];

  const today = new Date();
  today.setHours(0,0,0,0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  return allDailyTasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    taskDate.setHours(0,0,0,0);

    if (hustleView === "TODAY") return taskDate.getTime() === today.getTime();
    if (hustleView === "YESTERDAY") return taskDate.getTime() === yesterday.getTime();
    if (hustleView === "WEEK") return taskDate >= weekAgo;

    return true;
  });

}, [tasks, hustleView]);




  const fetchTasks = async () => {
    try {
      const res = await API.get("/task");

      const all = res.data;

      setTasks(all);

      
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

    // 🔥 FIX: include last typed tag
    if (dailyForm.tags.trim()) {
      const extra = dailyForm.tags
        .split(/[\s,\.]+/)
        .map((t) => t.trim())
        .filter(Boolean);

      finalTags = [...new Set([...finalTags, ...extra])];
    }

    try {
      setAdding(true);

      await API.post("/task", {
        title: dailyForm.title,
        type: "DAILY",
        tags: finalTags,
        note: dailyForm.note,
      });

      // RESET
      setDailyForm({ title: "", tags: "", note: "" });
      setTempTags([]);
      setIsFormOpen(false);

      fetchTasks();
    } catch (err) {
      console.error("ADD DAILY ERROR:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (["Enter", ",", " ", "."].includes(e.key)) {
      e.preventDefault();

      const value = dailyForm.tags.trim();
      if (!value) return;

      const parts = value
        .split(/[\s,\.]+/)
        .map((t) => t.trim())
        .filter(Boolean);

      setTempTags((prev) => [...new Set([...prev, ...parts])]);
      setDailyForm((prev) => ({ ...prev, tags: "" }));
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoadingId(id); // ✅ start loader

      await API.delete(`/task/${id}`);

      await fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null); // ✅ stop loader
    }
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
    try {
      setLoadingId(id);
      await API.put(`/task/toggle/${id}`);
      await fetchTasks();
    } finally {
      setLoadingId(null);
    }
  };

  const addAssignment = async () => {
    if (!newQuest.title) return;

    try {
      setAddingQuest(true);

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
    } finally {
      setAddingQuest(false);
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

  const completedTasks = assignments.filter((t) => t.status === "COMPLETED");

  const recentCompleted = completedTasks.sort((a, b) => {
    return new Date(b.completedAt) - new Date(a.completedAt);
  });

  const displayList = [...paginatedActive, ...recentCompleted];

  const totalAssignments = assignments.length;

  const completedAssignments = assignments.filter(
    (t) => t.status === "COMPLETED",
  ).length;

  const pendingAssignments = totalAssignments - completedAssignments;

  const overdueAssignments = assignments.filter(
    (t) =>
      t.due_date &&
      new Date(t.due_date) < new Date() &&
      t.status !== "COMPLETED",
  ).length;

  const academicCompletion = totalAssignments
    ? Math.round((completedAssignments / totalAssignments) * 100)
    : 0;

  const today = new Date().toDateString();

  const todayTasks = dailyTasks.filter(
    (t) => new Date(t.createdAt).toDateString() === today,
  );

  const completedToday = todayTasks.filter((t) => t.status === "DONE").length;

  const totalDaily = todayTasks.length;

  const productivityRate = totalDaily
    ? Math.round((completedToday / totalDaily) * 100)
    : 0;

  const completedDaily = dailyTasks.filter((t) => t.status === "DONE").length;

  const calculateStreak = () => {
    const doneDates = allDailyTasks
      .filter((t) => t.status === "DONE")
      .map((t) => new Date(t.createdAt).toDateString());

    const unique = [...new Set(doneDates)].sort(
      (a, b) => new Date(b) - new Date(a),
    );

    let streak = 0;
    let current = new Date();

    for (let i = 0; i < unique.length; i++) {
      if (new Date(unique[i]).toDateString() === current.toDateString()) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else break;
    }

    return streak;
  };

  const streak = calculateStreak();

  const getWeeklyStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create last 7 days (including today)
    const days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));

      return {
        date,
        done: 0,
        total: 0,
      };
    });

    // Fill data
    allDailyTasks.forEach((task) => {
      const taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);

      days.forEach((day) => {
        if (day.date.getTime() === taskDate.getTime()) {
          day.total++;

          if (task.status === "DONE") {
            day.done++;
          }
        }
      });
    });

    const max = Math.max(...days.map((d) => d.done), 1);

    return days.map((d) => ({
      date: d.date,
      percent: d.total ? Math.round((d.done / d.total) * 100) : 0,
    }));
  };

  const weeklyData = getWeeklyStats();

  const getInsight = () => {
    if (overdueAssignments > 0) {
      return `⚠️ ${overdueAssignments} overdue quests. Clear them immediately.`;
    }

    if (pendingAssignments > 5) {
      return "📚 Too many pending quests. Focus on deadlines first.";
    }

    if (academicCompletion > 80) {
      return "🔥 Excellent academic progress. You're on track.";
    }

    if (productivityRate < 40) {
      return "⚡ Low daily productivity. Improve your hustle consistency.";
    }

    if (streak >= 5) {
      return "💪 Strong habit streak. Keep your momentum.";
    }

    return "📈 Balanced progress. Stay consistent.";
  };

  const avgProgress =
    assignments.length > 0
      ? Math.round(
          assignments.reduce((sum, t) => sum + (t.progress || 0), 0) /
            assignments.length,
        )
      : 0;

  const getOverallTimeline = () => {
    const map = {};

    // 🔥 Combine BOTH (daily + assignments)
    const allTasks = [...allDailyTasks, ...assignments];

    allTasks.forEach((task) => {
      const date = new Date(task.createdAt).toLocaleDateString();

      if (!map[date]) {
        map[date] = { total: 0, done: 0 };
      }

      map[date].total++;

      if (task.status === "DONE" || task.status === "COMPLETED") {
        map[date].done++;
      }
    });

    // Convert to sorted array
    const sorted = Object.keys(map)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((date) => {
        const { total, done } = map[date];
        return {
          percent: total ? Math.round((done / total) * 100) : 0,
          done,
          total,
          date,
        };
      });

    return sorted.slice(-30); // last 30 days
  };

  const overallData = getOverallTimeline();

  const trend =
    overallData[overallData.length - 1] > overallData[0]
      ? "improving 📈"
      : "needs focus 📉";

  const QUOTES = {
    motivation: [
      "Push yourself, because no one else is going to do it for you.",
      "Great things never come from comfort zones.",
      "Dream it. Wish it. Do it.",
      "Stay focused and never give up.",
      "Small progress is still progress.",
      "Success is built on daily habits, not luck.",
    ],

    discipline: [
      "Discipline is choosing what you want most over what you want now.",
      "We become what we repeatedly do. – Aristotle",
      "Consistency beats motivation.",
      "Do it even when you don’t feel like it.",
      "Habits shape your future.",
    ],

    study: [
      "Focus on learning, not just results.",
      "Study now, so you don’t regret later.",
      "Every hour you invest compounds.",
      "Knowledge today is power tomorrow.",
    ],

    productivity: [
      "Start small, but start now.",
      "Done is better than perfect.",
      "Prioritize what matters.",
      "One task at a time.",
    ],

    mindset: [
      "You are capable of more than you think.",
      "Failure is part of success.",
      "Growth begins outside your comfort zone.",
      "Your mindset determines your future.",
    ],
  };

  let lastQuote = "";

  const getMotivationalQuote = () => {
    const categories = Object.keys(QUOTES);

    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];

    const quotes = QUOTES[randomCategory];

    let newQuote;

    do {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } while (newQuote === lastQuote);

    lastQuote = newQuote;

    return newQuote;
  };

  const getSmartQuote = () => {
    if (streak >= 5) {
      return "🔥 You're on a strong streak — don’t break it!";
    }

    if (productivityRate < 40) {
      return "⚡ Low productivity today. Start with one small task.";
    }

    if (pendingAssignments > 5) {
      return "📚 Too many pending tasks — focus and clear them one by one.";
    }

    // fallback random
    return getMotivationalQuote();
  };

  const getDailyQuote = () => {
    const today = new Date().toDateString();

    const stored = localStorage.getItem("dailyQuote");

    if (stored) {
      const parsed = JSON.parse(stored);

      if (parsed.date === today) {
        return parsed.quote; // ✅ SAME QUOTE ALL DAY
      }
    }

    // 🔥 Generate new only once per day
    const newQuote = getSmartQuote();

    localStorage.setItem(
      "dailyQuote",
      JSON.stringify({
        date: today,
        quote: newQuote,
      }),
    );

    return newQuote;
  };

  useEffect(() => {
    setDailyQuote(getDailyQuote());
  }, []);

  const totalDone = overallData.reduce((a, b) => a + b.done, 0);
  const totalAll = overallData.reduce((a, b) => a + b.total, 0);

  const overallRate = totalAll ? Math.round((totalDone / totalAll) * 100) : 0;

  const getWeeklyAvgData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ❌ exclude today
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const days = Array.from({ length: 6 }).map((_, i) => {
      const date = new Date(yesterday);
      date.setDate(yesterday.getDate() - (5 - i));

      return {
        date,
        done: 0,
        total: 0,
      };
    });

    allDailyTasks.forEach((task) => {
      const taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);

      days.forEach((day) => {
        if (day.date.getTime() === taskDate.getTime()) {
          day.total++;
          if (task.status === "DONE") day.done++;
        }
      });
    });

    return days.map((d) => ({
      percent: d.total ? Math.round((d.done / d.total) * 100) : 0,
    }));
  };

  const weeklyAvgData = getWeeklyAvgData();

  const avg =
    weeklyAvgData.length > 0
      ? (
          weeklyAvgData.reduce((a, b) => a + b.percent, 0) /
          weeklyAvgData.length
        ).toFixed(2)
      : "0.00";



      

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
              <div className="absolute -top-10 -right-10 h-40 w-40 bg-blue-500/5 blur-[80px] rounded-full" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b-1 border-slate-300 ">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 mb-6">
                  {/* 🎓 Academic */}
                  <StatCard
                    icon={<CheckCircle2 className="text-emerald-500" />}
                    val={`${academicCompletion}%`}
                    label="Assignments Completed"
                  />

                  <StatCard
                    icon={<Target className="text-blue-500" />}
                    val={pendingAssignments}
                    label="Assignments Pending"
                  />

                  <StatCard
                    icon={<Clock className="text-red-500" />}
                    val={overdueAssignments}
                    label="Assignments Overdue"
                  />

                  {/* ⚡ Daily */}
                  <StatCard
                    icon={<Flame className="text-orange-500" />}
                    val={streak}
                    label="Daily Streak (Days)"
                  />

                  <StatCard
                    icon={<CheckCircle2 className="text-indigo-500" />}
                    // val={completedToday}
                    val={
                      completedToday
                        ? `${completedToday}/${todayTasks.length}`
                        : "0"
                    }
                    label="Tasks Done Today"
                  />

                  <StatCard
                    icon={<TrendingUp className="text-purple-500" />}
                    val={`${productivityRate}%`}
                    label="Today's Productivity"
                  />
                </div>
              </div>
            </section>

            {/* DUAL SECTION */}
            <div className="grid grid-cols-12 gap-8">
              {/* LEFT: ACADEMIC QUESTS */}
              <div className="col-span-12 lg:col-span-8 space-y-3 lg:space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">
                    Academic Quests
                  </h3>
                  <button
                    onClick={() => setShowQuestModal(true)}
                    className="hidden lg:block bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:scale-105 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => setShowQuestModal(true)}
                    className="lg:hidden bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:scale-105 transition-all"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <p className="text-xs text-slate-400 font-bold">
                  Showing {paginatedActive.length} of {activeTasks.length}{" "}
                  active quests
                </p>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-6 gap-2">
                  {paginatedActive.map((item) => {
                    const isDone = item.status === "COMPLETED";

                    const isLoading = loadingId === item._id;

                    const isOverdue =
                      !isDone &&
                      item.due_date &&
                      new Date(item.due_date) < new Date();

                    const isExpanded = expandedTasks[item._id];

                    const needsTitleToggle =
                      item.title && item.title.length > 40;

                    return (
                      <div
                        key={item._id}
                        className={`w-full p-4 sm:p-6 rounded-3xl border transition-all duration-300
${isLoading ? "opacity-50 pointer-events-none" : ""}

${
  isDone
    ? "opacity-70 border-emerald-200 bg-emerald-50/40"
    : isOverdue
      ? "border-red-500 bg-red-300/40"
      : "bg-white border-slate-100 shadow-sm hover:shadow-md"
}`}
                      >
                        {/* 🔥 HEADER */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          {/* LEFT ICON */}
                          <div
                            className={`p-2 rounded-xl shrink-0 ${
                              isDone ? "bg-emerald-500" : item.color
                            } text-white`}
                          >
                            <BookOpen size={16} />
                          </div>

                          {/* RIGHT STATUS */}
                          <div className="flex flex-col items-end text-right">
                            <span
                              className={`text-[10px] font-black flex items-center gap-1 uppercase tracking-widest
${
  isDone
    ? "text-emerald-500"
    : isOverdue
      ? "text-red-500"
      : item.due_date
        ? "text-slate-400"
        : "text-amber-500"
}`}
                            >
                              {isOverdue && (
                                <span className="text-red-500 font-bold px-1 border border-red-500 rounded-2xl">
                                  Overdue
                                </span>
                              )}

                              <Clock size={12} />
                              {isDone
                                ? "Completed"
                                : item.due_date
                                  ? new Date(item.due_date).toLocaleDateString()
                                  : "No Deadline"}
                            </span>
                            <div className="flex items-center gap-2">
                              {/* COMPLETE */}
                              <button
                                onClick={() => handleComplete(item._id)}
                                disabled={isLoading}
                                className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all
      ${
        isDone
          ? "bg-emerald-100 text-emerald-600"
          : isOverdue
            ? "bg-red-100 text-red-600"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
      }`}
                              >
                                {isLoading
                                  ? "..."
                                  : isDone
                                    ? "Undo"
                                    : "Complete"}
                              </button>

                              {/* 🔥 DELETE BUTTON */}
                              <button
                                onClick={() => deleteTask(item._id)}
                                disabled={isLoading}
                                className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-all flex items-center justify-center"
                              >
                                {isLoading ? (
                                  <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 🔥 TITLE */}
                        <h4
                          className={`font-bold text-base sm:text-lg leading-snug break-words ${
                            isDone
                              ? "line-through text-slate-400"
                              : "text-slate-800"
                          }`}
                        >
                          {isExpanded
                            ? item.title
                            : item.title?.length > 60
                              ? item.title.slice(0, 60) + "..."
                              : item.title}
                        </h4>

                        {/* 🔥 DESCRIPTION */}
                        <p className="text-xs lg:text-sm text-slate-500 mt-1 break-words">
                          {isExpanded
                            ? item.note
                            : item.note?.length > 108
                              ? item.note.slice(0, 108) + "..."
                              : item.note || "No description provided..."}
                        </p>

                        {(item.note?.length > 108 ||
                          item.title?.length > 60) && (
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => toggleReadMore(item._id)}
                              className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                            >
                              {isExpanded ? "Less" : "Details"}
                            </button>
                          </div>
                        )}

                        {/* 🔥 PROGRESS */}
                        <div className="mt-3">
                          <div className="flex justify-between text-[10px] font-bold uppercase">
                            <span className="text-slate-500/80">Progress</span>
                            <span
                              className={
                                isDone ? "text-emerald-500" : "text-blue-500"
                              }
                            >
                              {item.progress || 0}%
                            </span>
                          </div>

                          <div className="mt-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-700 ${
                                isDone
                                  ? "bg-emerald-500"
                                  : isOverdue
                                    ? "bg-red-500"
                                    : item.color
                              }`}
                              style={{ width: `${item.progress || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {visibleCount < activeTasks.length && (
                    <div className="col-span-1 lg:col-span-2 text-center mt-4">
                      <button
                        onClick={() => setVisibleCount((prev) => prev + 3)}
                        className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl"
                      >
                        Show {Math.min(3, activeTasks.length - visibleCount)}{" "}
                        More
                      </button>
                    </div>
                  )}

                  {/* 🔥 SECTION TITLE */}
                  {recentCompleted.length > 0 && (
                    <h4 className="col-span-1 lg:col-span-2 text-xs font-bold text-slate-400 mt-6 border-t pt-3">
                      Recently Completed
                    </h4>
                  )}

                  <p className="col-span-1 lg:col-span-2 text-[10px] text-slate-400">
                    Showing {Math.min(completedCount, recentCompleted.length)}{" "}
                    of {recentCompleted.length} completed
                  </p>

                  {/* 🔥 COMPLETED TASKS (USE SAME CARD UI) */}
                  {recentCompleted.slice(0, completedCount).map((item) => {
                    const isDone = true;
                    const isLoading = loadingId === item._id;

                    return (
                      <div
                        key={item._id}
                        className={`w-full bg-green-200/30 p-4 sm:p-6 rounded-3xl border transition-all duration-300
  border-emerald-500 bg-emerald-50/40
  ${isLoading ? "opacity-50 pointer-events-none" : ""}
`}
                      >
                        {/* 🔥 HEADER */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          {/* ICON */}
                          <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0">
                            <BookOpen size={16} />
                          </div>

                          {/* STATUS + ACTION */}
                          <div className="flex flex-col items-end text-right">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                              Completed
                            </span>

                            <button
                              onClick={() => handleComplete(item._id)}
                              className="mt-2 text-[10px] font-bold px-3 py-1 rounded-full 
        bg-white border border-emerald-200 text-emerald-600 
        hover:bg-emerald-100 transition-all"
                            >
                              Undo
                            </button>
                          </div>
                        </div>

                        {/* 🔥 TITLE */}
                        <h4 className="font-bold text-base sm:text-lg line-through text-slate-400 leading-snug">
                          {item.title}
                        </h4>

                        {/* 🔥 DESCRIPTION */}
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2 break-words">
                          {item.note || "No description provided"}
                        </p>

                        {/* 🔥 FOOTER */}
                        <div className="flex justify-between items-center mt-3 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-500 font-semibold">
                              ✔ Done
                            </span>

                            {item.status === "COMPLETED" &&
                              item.completedAt && (
                                <span className="text-[9px] text-slate-400">
                                  Completed on{" "}
                                  {new Date(
                                    item.completedAt,
                                  ).toLocaleDateString()}
                                </span>
                              )}
                          </div>

                          <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-lg ">
                            Due Date:{" "}
                            {item.due_date
                              ? new Date(item.due_date).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {completedCount < recentCompleted.length && (
                    <div className="col-span-1 lg:col-span-2 text-center mt-2">
                      <button
                        onClick={() => setCompletedCount((prev) => prev + 2)}
                        className="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl"
                      >
                        Show{" "}
                        {Math.min(2, recentCompleted.length - completedCount)}{" "}
                        More Completed
                      </button>
                    </div>
                  )}
                </div>

                {/* DAILY HUSTLE (Updated Add Section) */}
                <div className="mt-5 lg:mt-10">
                  {/* IMPACTFUL ADD FORM */}
                  <div className="space-y-2 lg:space-y-4 mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h3 className="text-lg font-black text-slate-900">
                        {hustleView === "TODAY" && "Today's Hustle"}
                        {hustleView === "YESTERDAY" && "Yesterday's Hustle"}
                        {hustleView === "WEEK" && "This Week Hustle"}
                      </h3>

                      {/* 🔥 FILTER BUTTONS */}
                      <div className="flex gap:1 md:gap-2 bg-slate-100 p-1 rounded-xl">
                        {["TODAY", "YESTERDAY", "WEEK"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setHustleView(type)}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all
        ${
          hustleView === type
            ? "bg-white shadow text-blue-600"
            : "text-slate-400"
        }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className={`hidden md:block p-2 rounded-xl transition-all ${isFormOpen ? "bg-red-100 text-red-500 rotate-45" : "bg-blue-600 text-white"}`}
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <div className="flex items-center justify-end md:hidden gap-2">
                      <p className="text-xs font-bold text-slate-400">
                        Create Task
                      </p>
                      <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className={`md:hidden p-2 rounded-xl transition-all ${isFormOpen ? "bg-red-100 text-red-500 rotate-45" : "bg-blue-600 text-white"}`}
                      >
                        <Plus size={15} />
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
                              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
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
                              Keywords (Press Comma, space, fullstop to
                              separate)
                            </label>
                            <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-xl min-h-[44px]">
                              {tempTags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="flex items-center gap-1 bg-white border border-blue-100 text-[#7165E3] text-[10px] font-bold px-2 py-1 rounded-lg"
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
                                onKeyDown={(e) => {
                                  handleKeyDown(e);

                                  // 🔥 Prevent form submit
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                  }
                                }}
                                onChange={(e) => {
                                  const value = e.target.value;

                                  // Split by space, comma, dot
                                  if (/[\s,\.]/.test(value)) {
                                    const parts = value
                                      .split(/[\s,\.]+/)
                                      .map((t) => t.trim())
                                      .filter(Boolean);

                                    if (parts.length > 0) {
                                      setTempTags((prev) => [
                                        ...new Set([...prev, ...parts]),
                                      ]);
                                      setDailyForm({ ...dailyForm, tags: "" });
                                      return;
                                    }
                                  }

                                  setDailyForm({ ...dailyForm, tags: value });
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Description & Add Button */}
                        <div className="space-y-1 flexz">
                          <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                            Key Points / Description
                          </label>
                          <div className="flex gap-3 flex-col md:flex-row">
                            <input
                              className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
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
                              disabled={!dailyForm.title || adding}
                              className="px-6 rounded-xl font-black text-xs bg-[#7165E3] text-white flex items-center py-3 justify-center gap-2"
                            >
                              {adding ? (
                                <>
                                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                  Adding...
                                </>
                              ) : (
                                "ADD TASK"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {dailyTasks.slice(0, dailyVisible).map((task) => {
                      const isExpanded = expandedTasks[task._id];
                      const isDone = task.status === "DONE";

                      // Smart logic for UI states
                      const needsToggle =
                        (task.title && task.title.length > 40) ||
                        (task.note && task.note.length > 100) ||
                        (task.tags && task.tags.length > 3) || // 🔥 MANY TAGS
                        (task.tags && task.tags.join(" ").length > 40); // 🔥 LONG TAG TEXT
                      const isLoading = loadingId === task._id;
                      return (
                        <div
                          key={task._id}
                          className={`group relative overflow-hidden rounded-2xl border lg:p-3 transition-all duration-300
${
  isDone
    ? "bg-emerald-50 border-emerald-200"
    : "bg-white border-slate-100 hover:shadow-md"
} ${isLoading ? "opacity-50 pointer-events-none" : ""} `}
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
                                disabled={isLoading}
                                className="relative w-10 h-10 rounded-2xl flex items-center justify-center"
                              >
                                {isLoading ? (
                                  <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                  <CheckCircle2 size={20} />
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

                                <p className="text-xs text-slate-400 font-bold">
                                  {new Date(task.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      weekday: "short",
                                      day: "numeric",
                                      month: "short",
                                    },
                                  )}
                                </p>

                                {/* 🔥 DESCRIPTION PREVIEW */}
                                {task.note && (
                                  <p className="text-sm text-slate-500 mt-1 break-words">
                                    {isExpanded
                                      ? task.note
                                      : task.note?.length > 80
                                        ? task.note.slice(0, 80) + "..."
                                        : task.note}
                                  </p>
                                )}

                                <div className="flex flex-wrap gap-2 mt-2">
                                  {(task.tags?.length ? task.tags : ["General"])
                                    .slice(0, isExpanded ? task.tags.length : 2)
                                    .map((tag, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-1 text-[10px] font-bold rounded-md bg-blue-50 text-blue-600 break-all"
                                      >
                                        #{tag}
                                      </span>
                                    ))}

                                  {!isExpanded && task.tags?.length > 3 && (
                                    <span className="text-[10px] text-slate-400 font-bold">
                                      +{task.tags.length - 3}
                                    </span>
                                  )}
                                </div>

                                {needsToggle && !isExpanded && (
                                  <span className="text-[10px] text-indigo-500 font-bold">
                                    + More
                                  </span>
                                )}

                                {/* Optional dynamic timestamp or priority badge could go here */}
                              </div>
                            </div>

                            {/* ✅ ACTIONS SECTION (Responsive behavior) */}
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end sm:border-l sm:border-slate-100 sm:pl-6">
                              {needsToggle && (
                                <button
                                  onClick={() => toggleReadMore(task._id)}
                                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                  {isExpanded ? "Less" : "Details"}
                                </button>
                              )}

                              <button
                                onClick={() => deleteTask(task._id)}
                                disabled={isLoading}
                                className="p-2 rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
                              >
                                {isLoading ? (
                                  <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                  <Trash2 size={18} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {dailyVisible < dailyTasks.length && (
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setDailyVisible((prev) => prev + 3)}
                        className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl"
                      >
                        Show {Math.min(3, dailyTasks.length - dailyVisible)}{" "}
                        More Tasks
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN (Performance) */}
              <div className="col-span-12 lg:col-span-4 space-y-8">
                <div
                  className="relative 
h-[320px] w-full p-3 lg:p-6
bg-white/80 backdrop-blur-xl
rounded-[1.5rem]
border border-slate-200/70
shadow-[0_10px_40px_rgba(0,0,0,0.05)]
overflow-visible select-none pointer-events-none;
"
                >
                  {/* Clean Header */}
                  <div className="flex justify-between items-end mb-8 px-2">
                    <div>
                      <h3 className="text-slate-900 text-lg font-black tracking-tight leading-none">
                        Weekly Productivity
                      </h3>
                      <p className="text-slate-400 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest mt-1 italic">
                        Visualizing Efficiency
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] lg:text-[10px] font-black text-slate-300 uppercase block tracking-tighter">
                        Avg completion rate
                      </span>
                      <span className="text-2xl font-black text-slate-800 leading-none">
                        {Number(avg).toFixed(2)}
                        <span className="text-sm text-slate-400 ml-0.5">%</span>
                      </span>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height="85%">
                    <AreaChart
                      data={weeklyData}
                      margin={{ top: 15, right: 45, left: -28, bottom: 25 }}
                      style={{
                        outline: "none",
                        cursor: "default",
                        pointerEvents: "none",
                      }}
                    >
                      {/* Soft gradient */}
                      <defs>
                        <linearGradient
                          id="softFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#6366f1"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="100%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      {/* Grid */}
                      <CartesianGrid vertical={false} stroke="#e2e8f0" />

                      {/* X Axis */}
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        padding={{ left: 10, right: 10 }}
                        tick={{
                          fill: "#64748b",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                        dy={10}
                        tickFormatter={(date) =>
                          new Date(date)
                            .toLocaleDateString("en-IN", { weekday: "short" })
                            .toUpperCase()
                        }
                      />

                      {/* Y Axis */}
                      <YAxis
                        domain={[0, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                        tickFormatter={(v) => `${v}%`}
                      />

                      {/* Tooltip */}
                      <Tooltip
                        cursor={{ stroke: "#e2e8f0", strokeWidth: 6 }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const val = Number(payload[0].value);

                            return (
                              <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl">
                                <p className="text-xs text-slate-400 mb-1 font-bold uppercase">
                                  {new Date(
                                    payload[0].payload.date,
                                  ).toLocaleDateString("en-IN", {
                                    weekday: "long",
                                  })}
                                </p>

                                <p className="text-xl font-black">
                                  {val.toFixed(2)}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      {/* Average line */}
                      <ReferenceLine
                        y={avg}
                        stroke="#6366f1"
                        strokeWidth={1.5}
                        strokeDasharray="5 5"
                      />

                      <div
                        className="absolute right-[-75px]"
                        style={{
                          top: `${(1 - avg / 100) * 85}%`,
                          transform: "translateY(-50%)",
                        }}
                      >
                        <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg shadow-md">
                          <p className="text-[9px] font-black leading-none uppercase">
                            AVG
                          </p>
                          <p className="text-sm font-black leading-none">
                            {Number(avg).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      {/* Area */}
                      <Area
                        type="monotone"
                        dataKey="percent"
                        stroke="#4f46e5"
                        strokeWidth={3}
                        fill="url(#softFill)"
                        label={({ x, y, value, index }) => {
                          const isToday = index === weeklyData.length - 1;

                          return (
                            <text
                              x={x}
                              y={y - 10}
                              textAnchor="middle"
                              fontSize={isToday ? "10" : "8"}
                              fontWeight={isToday ? "900" : "600"}
                              fill={isToday ? "#4f46e5" : "#64748b"}
                            >
                              {value.toFixed(0)}%
                            </text>
                          );
                        }}
                        dot={({ cx, cy }) => (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill="#fff"
                            stroke="#4f46e5"
                            strokeWidth={2}
                          />
                        )}
                        activeDot={{
                          r: 6,
                          fill: "#0f172a",
                          stroke: "#fff",
                          strokeWidth: 3,
                        }}
                        animationDuration={800}
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  <div
                    className="absolute right-[5px]"
                    style={{
                      top: `${((100 - Number(avg)) / 100) * 260 + 60}px`,
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="bg-indigo-600 text-white px-[4px] py-1 rounded-lg shadow-md">
                      <p className="text-[7px] font-black leading-none uppercase">
                        AVG {Number(avg).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  Daily Completion: {completedDaily}/{totalDaily} •
                  Productivity: {productivityRate}%
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Academic: {completedAssignments}/{totalAssignments} completed
                </p>

                <div className="bg-gradient-to-br from-[#7165E3] to-[#8B5CF6] p-8 rounded-[3rem] text-white shadow-xl shadow-blue-100">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <BarChart3 size={24} />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black opacity-60 uppercase tracking-widest italic">
                        Academic Streak
                      </p>
                      <p className="text-2xl font-black">{streak} Days</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold mb-2 uppercase">
                    Ready for Exams?
                  </h4>
                  <p className="text-xs opacity-70 mb-6">{getInsight()}</p>
                  <button className="w-full py-4 bg-white text-[#7165E3] rounded-2xl font-black text-[11px] uppercase tracking-widest">
                    View Rankings
                  </button>
                </div>

                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                  <h3 className="text-lg font-black mb-1">Overall Progress</h3>
                  <p className="text-xs text-slate-400 font-bold mb-6 uppercase">
                    From Start to Now
                  </p>

                  <div className="flex items-end h-32 gap-1">
                    {overallData.map((day, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center flex-1"
                      >
                        {/* DATA */}
                        <span className="text-[9px] text-slate-400">
                          {day.done}/{day.total}
                        </span>

                        {/* BAR CONTAINER */}
                        <div className="w-full h-32 flex items-end">
                          <div
                            className="w-full bg-blue-100 rounded-t-md hover:bg-blue-500 transition-all"
                            style={{ height: `${day.percent}%` }}
                          />
                        </div>

                        {/* DATE */}
                        <span className="text-[8px] text-slate-300 mt-1">
                          {new Date(day.date).getDate()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 mt-3 font-semibold">
                    Last 30 Days: {overallData.reduce((a, b) => a + b.done, 0)}{" "}
                    tasks completed out of{" "}
                    {overallData.reduce((a, b) => a + b.total, 0)} total
                  </p>

                  <p className="text-xs text-slate-500 mt-2">
                    Overall completion rate: <b>{overallRate}%</b>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MODAL FOR ADDING QUESTS */}
          {showQuestModal && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-300">
              {/* Backdrop with a heavier blur for focus */}
              <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={() => setShowQuestModal(false)}
              />

              {/* Modal Container */}
              <div
                className="relative bg-white w-full max-w-lg overflow-hidden shadow-2xl 
      rounded-t-[2rem] sm:rounded-[2.5rem] 
      animate-in fade-in slide-in-from-bottom-10 duration-300"
              >
                {/* Decorative Top Accent */}
                <div className="h-2 w-full bg-gradient-to-r from-[#7165E3] to-[#9288f8]" />

                <div className="p-6 sm:p-10">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                        New Academic Quest
                      </h3>
                      <p className="text-slate-400 text-sm font-medium">
                        Add a task to your journey
                      </p>
                    </div>
                    <button
                      onClick={() => setShowQuestModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
                    >
                      <X
                        className="text-slate-400 group-hover:text-slate-600"
                        size={24}
                      />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Title Input Group */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Mission Title
                      </label>
                      <input
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-[#7165E3]/20 focus:bg-white rounded-2xl outline-none transition-all text-slate-700 font-medium"
                        placeholder="e.g. Advanced Calculus Paper"
                        value={newQuest.title}
                        onChange={(e) =>
                          setNewQuest({ ...newQuest, title: e.target.value })
                        }
                      />
                    </div>

                    {/* Description Group */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Briefing (Optional)
                      </label>
                      <textarea
                        rows={3}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-[#7165E3]/20 focus:bg-white rounded-2xl outline-none transition-all text-slate-700 resize-none font-medium"
                        placeholder="What needs to be done?"
                        value={newQuest.note}
                        onChange={(e) =>
                          setNewQuest({ ...newQuest, note: e.target.value })
                        }
                      />
                    </div>

                    {/* Date Picker Group */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Deadline
                      </label>
                      <div className="relative">
                        <input
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-[#7165E3]/20 focus:bg-white rounded-2xl outline-none transition-all text-slate-700 font-medium appearance-none"
                          type="date"
                          value={newQuest.deadline}
                          onChange={(e) =>
                            setNewQuest({
                              ...newQuest,
                              deadline: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={addAssignment}
                      disabled={addingQuest}
                      className="w-full py-4 bg-[#7165E3] text-white rounded-2xl font-black flex items-center justify-center gap-2"
                    >
                      {addingQuest ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <PlusCircle size={20} />
                          EMBARK ON QUEST
                        </>
                      )}
                    </button>
                  </div>
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
    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${active ? "bg-[#7165E3] text-white shadow-lg shadow-blue-100" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}`}
  >
    {icon}
    <span className="font-bold text-sm">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto" />}
  </div>
);

const StatCard = ({ icon, val, label }) => (
  <div className="bg-white px-1 py-2 lg:px-5 lg:py-3 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
    <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-lg font-black text-slate-900 leading-none">{val}</p>
      <p className="text-[7px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
        {label}
      </p>
    </div>
  </div>
);

export default StudentDashboard;
