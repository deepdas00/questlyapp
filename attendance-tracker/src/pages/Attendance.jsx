import React, { useState } from "react";
import {
  Target,
  Calculator,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Globe,
  Sparkles,
  UserX,
  CheckCircle2,
  Clock,
  Check,
  BookOpen,
  UserCheck,
  RotateCcw,
  X,
  Zap,
  Activity,
  XCircle,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

import { useEffect } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";

const Attendance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [predictDays, setPredictDays] = useState(5);
  const [loadingType, setLoadingType] = useState(null);

  const {
  subjects,
  setSubjects,
  attendance,
  setAttendance,
  routine,
  setRoutine,
  semester,
  setSemester,
} = useApp();


const safeAttendance = attendance || [];
const safeSubjects = subjects || [];
const safeRoutine = routine || [];



  const fetchSemester = async () => {
    try {
      const res = await API.get("/semester/active");
      setSemester(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  const fetchRoutine = async () => {
    try {
      const res = await API.get("/routine");
      setRoutine(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();


  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async () => {
    try {
      const res = await API.get("/subject");
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance");
      setAttendance(res.data); 
    } catch (err) {
      console.error(err);
    }
  };

useEffect(() => {
  fetchSubjects();
  fetchAttendance();
  fetchRoutine();
  fetchSemester();
}, []);

  const target = semester?.target_percentage ?? 75;

  const daysLeft = (() => {
    if (!semester?.end_date) return 0;

    const today = new Date();
    const end = new Date(semester.end_date);

    const diff = end - today;

    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  })();

  const classesPerDay = (() => {
    if (!routine.length) return 0;

    const days = {};

    routine.forEach((r) => {
      const d = r.day_of_week;
      days[d] = (days[d] || 0) + 1;
    });

    const total = Object.values(days).reduce((a, b) => a + b, 0);
    return Math.round(total / Object.keys(days).length);
  })();

  const getSelectedDayName = () => {
    return selectedDate
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase()
      .slice(0, 3); // MON, TUE...
  };

  const selectedDayName = getSelectedDayName();

  const todaysRoutine = safeRoutine.filter(
    (r) =>
      r.day_of_week?.toUpperCase().trim() ===
      selectedDayName.toUpperCase().trim(),
  );

  todaysRoutine.sort((a, b) =>
    (a.start_time || "").localeCompare(b.start_time || ""),
  );

  // Logic: Manual Subject Update
  const updateSubject = async (routineId, subjectId, type) => {
    if (isHoliday) {
      alert("Holiday hai 😄 Reset karo pehle");
      return;
    }

    try {
      setLoadingType("subject");
      const localDate = new Date(selectedDate);
      localDate.setHours(12, 0, 0, 0); // 🔥 force mid-day (avoid timezone shift)

      await API.post("/attendance/mark-subject", {
        date: localDate.toISOString(),
        routine_id: routineId,
        subject_id: subjectId,
        status: type === "present" ? "PRESENT" : "ABSENT",
      });

      await fetchAttendance();
      await fetchSubjects();
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
    } finally {
      setLoadingType(null);
    }
  };
  // Logic: Global Whole Day Actions
  const handleGlobalAction = async (type) => {
    if (type !== "holiday" && type !== "reset" && todaysRoutine.length === 0) {
      alert("No classes today 🚫");
      return;
    }

    let apiType;

    if (type === "present") apiType = "PRESENT";
    else if (type === "absent") apiType = "ABSENT";
    else if (type === "holiday") apiType = "HOLIDAY";
    else if (type === "reset") apiType = "RESET"; // ✅ FIX

    try {
      setLoadingType("global");

      const localDate = new Date(selectedDate);
      localDate.setHours(12, 0, 0, 0); // 🔥 force mid-day (avoid timezone shift)

      await API.post("/attendance/mark-day", {
        date: localDate.toISOString(),
        type: apiType,
      });

      await fetchAttendance();
      await fetchSubjects();

      // ❌ REMOVE THIS BUG
      // setSelectedDate(new Date(selectedDate.getTime() + 1));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingType(null);
    }
  };

  const getDayStatus = (day) => {
    const found = safeAttendance.find((a) => {
      const d = new Date(a.date);
      return (
        d.getDate() === day &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });

    // ✅ NO DATA → NORMAL
    if (!found) {
      return "bg-white/10 text-white/40 border-white/5";
    }

    // ✅ RESET CASE (IMPORTANT FIX)
    if (
      found.day_type === "NORMAL" &&
      (!found.slots || found.slots.length === 0)
    ) {
      return "bg-white/10 text-white/40 border-white/5";
    }

    // ✅ HOLIDAY
    if (found.day_type === "HOLIDAY") {
      return "bg-[#8E9AAF]/70 text-white/90 border-transparent";
    }

    // ✅ MASS BUNK
    if (found.day_type === "MASS_BUNK") {
      return "bg-[#FF5C5C] text-white";
    }

    const slots = found.slots || [];
    const present = slots.filter((s) => s.status === "PRESENT").length;
    const total = slots.length;

    if (total > 0 && present === total) {
      return "bg-[#00D991] text-white";
    }

    if (total > 0 && present === 0) {
      return "bg-[#FF5C5C] text-white";
    }

    if (total > 0 && present < total) {
      return "bg-[#FFB100] text-white";
    }

    return "bg-white/10 text-white/40 border-white/5";
  };

  const getSelectedDayAttendance = () => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    return safeAttendance.find((a) => {
      const d = new Date(a.date);
      return d >= start && d <= end;
    });
  };

  const selectedDay = getSelectedDayAttendance();

  const slots = selectedDay?.slots || [];

  const isHoliday = selectedDay?.day_type === "HOLIDAY";

  const calculateStats = (attended, conducted) => {
    const perc = conducted ? ((attended / conducted) * 100).toFixed(1) : "0.0";

    const req = Math.ceil(
      (target * conducted - 100 * attended) / (100 - target),
    );

    const safe = Math.floor((100 * attended) / target - conducted);

    return {
      perc,
      req: req > 0 ? req : 0,
      safe: safe > 0 ? safe : 0,
    };
  };

  const totalAttended = safeSubjects.reduce((s, a) => s + a.attended_count, 0);

  const totalConducted = safeSubjects.reduce((s, a) => s + a.conducted_count, 0);

  const overall = calculateStats(totalAttended, totalConducted);

  const safeDays = Math.floor(overall.safe / classesPerDay);

  const needDays =
    classesPerDay > 0 ? Math.ceil(overall.req / classesPerDay) : 0;

  const predictAttendance = (days, mode) => {
    const totalFutureClasses = days * classesPerDay;

    let attended = totalAttended;
    let conducted = totalConducted;

    if (mode === "best") {
      attended += totalFutureClasses;
      conducted += totalFutureClasses;
    }

    if (mode === "average") {
      attended += Math.floor(totalFutureClasses / 2);
      conducted += totalFutureClasses;
    }

    if (mode === "worst") {
      conducted += totalFutureClasses;
    }

    const perc =
      conducted > 0 ? ((attended / conducted) * 100).toFixed(1) : "0.0";

    return perc;
  };

  const worst = predictAttendance(predictDays, "worst");
  const avg = predictAttendance(predictDays, "average");
  const best = predictAttendance(predictDays, "best");

  const calculateImpact = (days, mode) => {
    const futureClasses = days * classesPerDay;

    let attended = totalAttended;
    let conducted = totalConducted;

    const currentPerc = conducted > 0 ? (attended / conducted) * 100 : 0;

    if (mode === "perfect") {
      attended += futureClasses;
      conducted += futureClasses;
    }

    if (mode === "bunk") {
      conducted += futureClasses;
    }

    const newPerc = conducted > 0 ? (attended / conducted) * 100 : 0;

    return {
      current: currentPerc.toFixed(1),
      next: newPerc.toFixed(1),
      diff: (newPerc - currentPerc).toFixed(1),
    };
  };

  const impactDays = 5; // or make dynamic later

  const perfectImpact = calculateImpact(impactDays, "perfect");
  const bunkImpact = calculateImpact(impactDays, "bunk");

  const perfect = calculateImpact(impactDays, "perfect");
  const bunk = calculateImpact(impactDays, "bunk");

  const getMonthlyStats = () => {
    let total = 0;
    let present = 0;

    safeAttendance.forEach((day) => {
      const d = new Date(day.date);

      // ✅ Only current calendar month
      if (d.getMonth() === month && d.getFullYear() === year) {
        const slots = day.slots || [];

        total += slots.length;

        present += slots.filter((s) => s.status === "PRESENT").length;
      }
    });

    const percent = total ? Math.round((present / total) * 100) : 0;

    return { total, present, percent };
  };

  const monthlyStats = getMonthlyStats();

  return (
    <div>
      <Navbar />

      <div className="flex min-h-screen bg-[#f0f4f8] text-slate-800 font-sans selection:bg-blue-500/30">
        {/* Background Gradient Orbs for Depth */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full" />
          <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-indigo-400/20 blur-[100px] rounded-full" />
        </div>

        {/* Overlay */}
        {/* ===== DESKTOP SIDEBAR ===== */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        

        <main className="flex-1 p-2 lg:p-10 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            {/* TOP NAV BAR */}

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end lg:mb-10 gap-3 lg:gap-8 border-b border-slate-200/60 mb-3 lg:pb-10">
              {/* Left Section: Typography & Branding */}
              <div className="relative flex flex-col justify-center items-center lg:block w-full lg:w-auto">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-[2px] w-6 bg-blue-600"></div>
                  <p className="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
                    Attendance Insights
                  </p>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                  QUESTLY
                  <span className="text-blue-600 ml-2">Attendance</span>
                </h1>

                <p className="text-slate-500 text-[7px] md:text-base font-medium mt-2 max-w-xs md:max-w-none">
                 Predict, analyze, and stay ahead of your attendance goals
                </p>
              </div>

              {/* Right Section: Tactical Action Buttons */}
              {/* Grid layout for mobile/tablet, flex for desktop */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap lg:flex-nowrap gap-3 md:gap-4 w-full lg:w-auto">
                {/* MASS BUNK */}
                <button
                  disabled={loadingType !== null}
                  onClick={() => handleGlobalAction("absent")}
                  className={`not-first-of-type:roup relative px-4 md:px-6 py-3 bg-white border border-red-100 rounded-2xl transition-all duration-200 shadow-[0_4px_0_0_rgba(254,226,226,1)] hover:shadow-[0_2px_0_0_rgba(254,226,226,1)] hover:translate-y-[2px] active:translate-y-[4px] w-full sm:w-auto ${loadingType ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-2 bg-red-50 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                      <UserX className="w-[15px] h-[15px] md:w-[18px] md:h-[18px] text-red-500 group-hover:text-white" />
                    </div>
                    <div className="text-left">
                      <span className="block text-[8px] md:text-[9px] font-bold text-red-400 uppercase tracking-tight leading-none mb-1">
                        Quick Action
                      </span>
                      <span className="block text-[10px] md:text-sm font-black text-slate-700 uppercase tracking-tight">
                        Absent
                      </span>
                    </div>
                  </div>
                </button>

                {/* MARK PRESENT */}
                <button
                  disabled={loadingType !== null}
                  onClick={() => handleGlobalAction("present")}
                  className={`group relative px-4 md:px-6 py-3 bg-blue-600 rounded-2xl transition-all duration-200 shadow-[0_4px_0_0_#1e3a8a] hover:shadow-[0_2px_0_0_#1e3a8a] hover:translate-y-[2px] active:translate-y-[4px] w-full sm:w-auto ${loadingType ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-2 bg-blue-500/30 rounded-xl">
                      <UserCheck className="w-[15px] h-[15px] md:w-[18px] md:h-[18px] text-white" />
                    </div>
                    <div className="text-left">
                      <span className="block text-[8px] md:text-[9px] font-bold text-blue-200 uppercase tracking-tight leading-none mb-1">
                        Mark All
                      </span>
                      <span className="block text-[10px] md:text-sm font-black text-white uppercase tracking-tight">
                        Present
                      </span>
                    </div>
                  </div>
                </button>

                {/* HOLIDAY */}
                <button
                  disabled={loadingType !== null}
                  onClick={() => handleGlobalAction("holiday")}
                  className={`group px-4 md:px-6 py-3 bg-white border border-slate-200 rounded-2xl transition-all duration-300 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 md:gap-3 w-full sm:w-auto ${loadingType ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="text-[17px] md:text-xl filter drop-shadow-sm group-hover:rotate-12 transition-transform">
                    🎉
                  </div>
                  <div className="text-left">
                    <span className="block text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">
                      No Classes
                    </span>
                    <span className="block text-[10px] md:text-sm font-black text-slate-700 uppercase tracking-tight">
                      Holiday
                    </span>
                  </div>
                </button>

                {/* RESET */}
                <button
                  disabled={loadingType !== null}
                  onClick={() => handleGlobalAction("reset")}
                  className={`group px-4 md:px-6 py-3 bg-white border border-slate-200 rounded-2xl transition-all duration-300 hover:bg-slate-50 hover:shadow-md flex items-center gap-2 md:gap-3 w-full sm:w-auto ${loadingType ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <RotateCcw
                    size={18}
                    className="text-orange-500 group-hover:rotate-[-45deg] transition-transform"
                  />
                  <span className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-tight">
                    Reset
                  </span>
                </button>
              </div>
            </div>

            {/* QUICK METRICS BAR */}

            <div className="grid grid-cols-4 gap-1.5 sm:gap-4 md:gap-6 mb-3 lg:mb-12">
              {[
                {
                  label: "OVERALL",
                  val: `${overall.perc}%`,
                  sub: `${totalAttended}/${totalConducted} classes`,
                  color: "text-blue-600",
                  icon: <TrendingUp size={16} />,
                  accent: "bg-blue-600",
                },
                {
                  label: "SAFE BUNKS CLASS",
                  val: overall.safe,
                  sub:
                    overall.safe > 0
                      ? `≈ ${Math.floor(overall.safe / classesPerDay)} days`
                      : "No buffer",
                  color: "text-emerald-600",
                  icon: <ShieldCheck size={16} />,
                  accent: "bg-emerald-600",
                },
                {
                  label: "NEED TO ATTEND CLASS",
                  val: overall.req,
                  sub: `≈ ${Math.ceil(overall.req / classesPerDay)} days`,
                  color: "text-orange-500",
                  icon: <Zap size={16} />,
                  accent: "bg-orange-500",
                },
                {
                  label: "AT RISK",
                  val: safeSubjects.filter(
                    (s) =>
                      (s.attended_count / s.conducted_count) * 100 < target,
                  ).length,
                  sub: `Below ${target}% target`,
                  color: "text-red-600",
                  icon: <Activity size={16} />,
                  accent: "bg-red-600",
                },
              ].map((m, i) => (
                <div
                  key={i}
                  className="group bg-white border border-slate-200 rounded-lg sm:rounded-[1.5rem] p-2 sm:p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between min-w-0"
                >
                  <div className="flex justify-between items-start mb-2 sm:mb-6">
                    {/* Text-size scales down to 7px on tiny screens to keep 'NEED TO ATTEND' on one line */}
                    <p className="text-[7px] sm:text-[9px] md:text-[10px] font-bold tracking-wider text-slate-400 uppercase leading-tight">
                      {m.label}
                    </p>
                    <div className="hidden lg:block text-slate-300 group-hover:text-slate-400 transition-colors shrink-0 scale-75 sm:scale-100">
                      {m.icon}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    {/* Value scales from text-lg (mobile) up to text-4xl (desktop) */}
                    <p
                      className={`text-lg sm:text-2xl md:text-4xl font-black tracking-tight leading-none ${m.color}`}
                    >
                      {m.val}
                    </p>
                    <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-slate-500 mt-1 truncate">
                      {m.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* COLUMN 1: SUBJECTS & ALERT */}
              <div className="lg:col-span-4 space-y-6">
                {/*mini calendar component*/}
                <div className="lg:hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.5rem] p-3 shadow-xl shadow-blue-500/20">
                  {/* Header with Legend */}

                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 text-white">
                      <CalendarIcon size={16} className="opacity-80" />
                      <h2 className="text-[14px] font-black uppercase tracking-widest">
                        Calendar
                      </h2>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="flex items-center gap-1.5 text-[8px] font-black uppercase text-white/90">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />{" "}
                        present
                      </span>
                      <span className="flex items-center gap-1.5 text-[8px] font-black uppercase text-white/90">
                        <div className="w-2 h-2 rounded-full bg-orange-400" />{" "}
                        mixed
                      </span>
                      <span className="flex items-center gap-1.5 text-[8px] font-black uppercase text-white/90">
                        <div className="w-2 h-2 rounded-full bg-red-400" />{" "}
                        absent
                      </span>
                    </div>
                  </div>

                  {/* Month Navigation */}

                  <div className="mt-2 flex justify-between px-1 text-center">
  
  <p className="text-[10px] text-white/80 font-bold">
    {monthlyStats.total === 0
      ? "No Classes"
      : `${monthlyStats.present}/${monthlyStats.total} Classes`}
  </p>

  <p
    className={`text-xs font-black ${
      monthlyStats.total === 0
        ? "text-white/50" // ✅ neutral color (no panic)
        : monthlyStats.percent >= target
        ? "text-emerald-300"
        : "text-red-300"
    }`}
  >
    {monthlyStats.total === 0
      ? `No Data for ${currentDate.toLocaleString("default", {
          month: "long",
        })}`
      : `${monthlyStats.percent}% Attendance on ${currentDate.toLocaleString(
          "default",
          { month: "long" }
        )}`}
  </p>

</div>
                  <div className="flex justify-between items-center px-2 mb-3">
                    <button
                      onClick={() =>
                        setCurrentDate(new Date(year, month - 1, 1))
                      }
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight italic">
                      {currentDate.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <button
                      onClick={() =>
                        setCurrentDate(new Date(year, month + 1, 1))
                      }
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-black text-white/40 text-center mb-2"
                      >
                        {d}
                      </span>
                    ))}

                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateObj = new Date(year, month, day);
                      const activeDate = selectedDate || new Date();
                      const isSelected =
                        day === activeDate.getDate() &&
                        month === activeDate.getMonth() &&
                        year === activeDate.getFullYear();

                      // 1. Determine status and assign specific color classes
                      const status = getDayStatus(day);

                      return (
                        <button
                          key={i}
                          onClick={() =>
                            !loadingType && setSelectedDate(dateObj)
                          }
                          className={`
        aspect-square flex items-center justify-center rounded-2xl text-[12px] font-black transition-all border backdrop-blur-md
        ${
          isSelected
            ? "ring-2 ring-white ring-offset-4 ring-offset-blue-600 scale-110 z-10 shadow-xl "
            : "hover:bg-white/20 hover:scale-105"
        }
          ${status}
       
       ${loadingType ? "pointer-events-none opacity-60" : ""}`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Date Header */}
                <div className="bg-white border border-slate-200 rounded-[1.2rem] md:rounded-[1.5rem] p-3 lg:p-6 md:p-6 shadow-sm relative overflow-hidden mb-3 md:mb-6 lg:mb-6">
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Selected Date
                  </p>

                  <div className="flex justify-between items-center gap-2">
                    <div className="min-w-0">
                      {" "}
                      {/* min-w-0 prevents text overflow issues */}
                      <h2 className="text-lg lg:text-2xl md:text-2xl font-black text-slate-900 leading-tight truncate">
                        {new Intl.DateTimeFormat("en-US", {
                          weekday: "long",
                        }).format(selectedDate)}
                      </h2>
                      <p className="text-[10px] lg:text-sm md:text-sm font-medium text-slate-500 truncate">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }).format(selectedDate)}
                      </p>
                    </div>

                    {/* Badge scales down slightly for mobile */}
                    <div className="shrink-0 px-2.5 py-0.5 md:px-3 md:py-1 bg-blue-100 rounded-full">
                      <span className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase">
                        Today
                      </span>
                    </div>
                  </div>
                </div>

                {/* Today's Classes Card */}
                <div className="bg-white border border-slate-200 rounded-[1.2rem] md:rounded-[1.5rem] p-3 lg:p-6 md:p-8 shadow-sm">
                  {/* Header Section */}
                  <div className="flex justify-between items-center mb-3 lg:mb-8 md:mb-8">
                    <div className="flex items-center gap-2 md:gap-3">
                      <BookOpen
                        size={18}
                        className="text-blue-600 md:w-5 md:h-5"
                      />
                      <h2 className="text-lg lg:text-xl md:text-xl font-black text-slate-900">
                        Today's Classes
                      </h2>
                    </div>
                    <div className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full flex items-center gap-1.5 md:gap-2">
                      <Globe
                        size={10}
                        className="text-blue-600 md:w-3 md:h-3"
                      />
                      <span className="text-[9px] md:text-[10px] font-black text-blue-700 uppercase">
                        {target}% Target
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    {isHoliday ? (
                      <div className="flex flex-col items-center justify-center py-10 md:py-12 px-6 bg-orange-50/30 border border-orange-100 rounded-[1.5rem] md:rounded-[2rem] text-center">
                        <div className="text-3xl md:text-4xl mb-3 md:mb-4">
                          🥂
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-orange-700">
                          Holiday!
                        </h3>
                        <p className="text-xs md:text-sm font-bold text-orange-600/80 mt-1">
                          Enjoy your day off
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 lg:space-y-6 md:space-y-6">
                        {todaysRoutine.map((r, idx) => {
                          const sub = subjects.find(
                            (s) =>
                              s._id.toString() ===
                              (r.subject_id?._id || r.subject_id)?.toString(),
                          );

                          if (!sub) return null;

                          const slot = slots.find(
                            (s) =>
                              (
                                s.routine_id?._id || s.routine_id
                              )?.toString() === r._id.toString(),
                          );

                          const currentStatus = slot?.status?.toLowerCase();
                          const attendancePerc = (
                            (sub.attended_count / sub.conducted_count) * 100 ||
                            0
                          ).toFixed(1);

                          const colorStyles = [
                            {
                              bg: "bg-purple-50/50",
                              border: "border-purple-100",
                              text: "text-purple-700",
                            },
                            {
                              bg: "bg-blue-50/50",
                              border: "border-blue-100",
                              text: "text-blue-700",
                            },
                            {
                              bg: "bg-amber-50/50",
                              border: "border-amber-100",
                              text: "text-amber-700",
                            },
                          ][idx % 3];

                          return (
                            <div
                              key={r._id}
                              className={`${colorStyles.bg} border ${colorStyles.border} p-3 lg:p-6 md:p-6 rounded-[1.2rem] md:rounded-[1.8rem] relative transition-all`}
                            >
                              {/* Card Title & Status */}
                              <div className="flex justify-between items-start mb-3 lg:mb-4 md:mb-4">
                                <div className="min-w-0">
                                  <h3
                                    className={`text-sm md:text-base font-black uppercase tracking-tight truncate ${colorStyles.text}`}
                                  >
                                    {sub.name}
                                  </h3>
                                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">
                                    {r.start_time} — {r.end_time} • {sub.code}
                                  </p>

                                  <p className="text-[10px] md:text-xs font-semibold text-slate-500 mt-1">
                                    👨‍🏫 {r.faculty || "No Faculty Assigned"}
                                  </p>
                                </div>

                                {currentStatus && (
                                  <span
                                    className={`shrink-0 ml-2 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase ${
                                      currentStatus === "present"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-red-500 text-white"
                                    }`}
                                  >
                                    {currentStatus}
                                  </span>
                                )}
                              </div>

                              {/* Attendance Info */}
                              <div className="flex justify-between items-end mb-1.5 md:mb-2">
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">
                                  {sub.attended_count}/{sub.conducted_count}{" "}
                                  attended
                                </p>
                                <p
                                  className={`text-[9px] md:text-[10px] font-black ${parseFloat(attendancePerc) < target ? "text-red-500" : "text-emerald-600"}`}
                                >
                                  {attendancePerc}%
                                </p>
                              </div>

                              {/* Progress Bar */}
                              <div className="w-full h-1.5 md:h-2 bg-slate-200/40 rounded-full overflow-hidden mb-5 md:mb-6">
                                <div
                                  className={`h-full transition-all duration-500 ${parseFloat(attendancePerc) < target ? "bg-orange-500" : "bg-emerald-500"}`}
                                  style={{ width: `${attendancePerc}%` }}
                                />
                              </div>

                              {/* Action Buttons */}
                              <div className="grid grid-cols-2 gap-2 md:gap-4">
                                <button
                                  disabled={loadingType !== null}
                                  onClick={() =>
                                    updateSubject(r._id, sub._id, "present")
                                  }
                                  className={`flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black transition-all shadow-sm ${
                                    currentStatus === "present"
                                      ? "bg-emerald-500 text-white"
                                      : "bg-white text-slate-700 border border-slate-200"
                                  } ${loadingType ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                  <Check
                                    size={16}
                                    strokeWidth={3}
                                    className="md:w-[18px] md:h-[18px]"
                                  />
                                  Present
                                </button>

                                <button
                                  disabled={loadingType !== null}
                                  onClick={() =>
                                    updateSubject(r._id, sub._id, "absent")
                                  }
                                  className={`flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black transition-all shadow-sm ${
                                    currentStatus === "absent"
                                      ? "bg-red-500 text-white"
                                      : "bg-white text-slate-700 border border-slate-200"
                                  } ${loadingType ? "opacity-50" : ""}`}
                                >
                                  <X
                                    size={16}
                                    strokeWidth={3}
                                    className="md:w-[18px] md:h-[18px]"
                                  />
                                  Absent
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* COLUMN 2: CALENDAR & PREDICTIONS */}
              <div className="lg:col-span-8 space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* CALENDAR MINI */}
                  <div className="hidden lg:block bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 shadow-xl shadow-blue-500/20">
                    {/* Header with Legend */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2 text-white">
                        <CalendarIcon size={18} className="opacity-80" />
                        <h2 className="text-sm font-black uppercase tracking-widest">
                          Calendar
                        </h2>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-white/90">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />{" "}
                          present
                        </span>
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-white/90">
                          <div className="w-2 h-2 rounded-full bg-orange-400" />{" "}
                          mixed
                        </span>
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-white/90">
                          <div className="w-2 h-2 rounded-full bg-red-400" />{" "}
                          absent
                        </span>
                      </div>
                    </div>




<div className="mt-2 flex justify-between px-1 text-center">
  
  <p className="text-[10px] text-white/80 font-bold">
    {monthlyStats.total === 0
      ? "No Classes"
      : `${monthlyStats.present}/${monthlyStats.total} Classes`}
  </p>

  <p
    className={`text-xs font-black ${
      monthlyStats.total === 0
        ? "text-white/50" // ✅ neutral color (no panic)
        : monthlyStats.percent >= target
        ? "text-emerald-300"
        : "text-red-300"
    }`}
  >
    {monthlyStats.total === 0
      ? `No Data for ${currentDate.toLocaleString("default", {
          month: "long",
        })}`
      : `${monthlyStats.percent}% Attendance on ${currentDate.toLocaleString(
          "default",
          { month: "long" }
        )}`}
  </p>

</div>

                  
                    {/* Month Navigation */}
                    <div className="flex justify-between items-center px-2 mb-8">
                      <button
                        onClick={() =>
                          setCurrentDate(new Date(year, month - 1, 1))
                        }
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight italic">
                        {currentDate.toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                      <button
                        onClick={() =>
                          setCurrentDate(new Date(year, month + 1, 1))
                        }
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-black text-white/40 text-center mb-2"
                        >
                          {d}
                        </span>
                      ))}

                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateObj = new Date(year, month, day);
                        const activeDate = selectedDate || new Date();
                        const isSelected =
                          day === activeDate.getDate() &&
                          month === activeDate.getMonth() &&
                          year === activeDate.getFullYear();

                        // 1. Determine status and assign specific color classes
                        const status = getDayStatus(day);

                        return (
                          <button
                            key={i}
                            onClick={() =>
                              !loadingType && setSelectedDate(dateObj)
                            }
                            className={`
        aspect-square flex items-center justify-center rounded-2xl text-[12px] font-black transition-all border backdrop-blur-md
        ${
          isSelected
            ? "ring-2 ring-white ring-offset-4 ring-offset-blue-600 scale-110 z-10 shadow-xl "
            : "hover:bg-white/20 hover:scale-105"
        }
          ${status}
       
      ${loadingType ? "pointer-events-none opacity-60" : ""} `}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* PREDICTION ENGINE */}

                  <div className="bg-[#121927] border border-white/5 rounded-[1.3rem] lg:rounded-[2.5rem] p-3 md:p-5 shadow-2xl">
                    <div className="space-y-8">
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        <Sparkles size={20} className="text-amber-400" />
                        <h2 className="text-sm font-black uppercase tracking-widest text-white">
                          Predictions
                        </h2>
                      </div>

                      {/* 🎯 INPUT CONTROL */}
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase mb-2">
                          Predict next days
                        </p>

                        <div className="flex items-center gap-4">
                          {/* Slider */}
                          <input
                            type="range"
                            min="1"
                            max={daysLeft || 30}
                            value={predictDays}
                            onChange={(e) =>
                              setPredictDays(Number(e.target.value))
                            }
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />

                          {/* Number Input */}
                          <input
                            type="number"
                            value={predictDays}
                            onChange={(e) =>
                              setPredictDays(Number(e.target.value))
                            }
                            className="w-14 sm:w-16 px-2 py-1 bg-white/10 text-white text-center rounded-lg outline-none border border-white/5 text-sm"
                          />
                        </div>
                      </div>

                      {/* 📊 PREDICTION CARDS */}
                      {/* Mobile: 1 col | Tablet: 2 cols | Desktop: 3 cols */}
                      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {/* Worst Case */}
                        <div className="p-3 md:p-3 rounded-[1.8rem] border border-red-500/20 bg-red-500/5 text-center transition-transform hover:scale-[1.02]">
                          <p className="text-[10px] font-black uppercase text-red-400 mb-2 tracking-widest">
                            Worst
                          </p>
                          <p className="text-2xl md:text-2xl font-black text-white mb-1">
                            {worst}%
                          </p>
                          <p className="text-[9px] text-white/40 uppercase">
                            Skip all classes
                          </p>
                        </div>

                        {/* Average Case */}
                        <div className="p-3 md:p-3 rounded-[1.8rem] border border-amber-500/20 bg-amber-500/5 text-center transition-transform hover:scale-[1.02]">
                          <p className="text-[10px] font-black uppercase text-amber-400 mb-2 tracking-widest">
                            Average
                          </p>
                          <p className="text-2xl md:text-2xl font-black text-white mb-1">
                            {avg}%
                          </p>
                          <p className="text-[9px] text-white/40 uppercase">
                            Attend half
                          </p>
                        </div>

                        {/* Best Case (Spans 2 columns on tablet for symmetry, or just 1 on desktop) */}
                        <div className="p-3 md:p-3 sm:col-span-2 lg:col-span-1 rounded-[1.8rem] border border-emerald-500/20 bg-emerald-500/5 text-center transition-transform hover:scale-[1.02]">
                          <p className="text-[10px] font-black uppercase text-emerald-400 mb-2 tracking-widest">
                            Best
                          </p>
                          <p className="text-2xl md:text-2xl font-black text-white mb-1">
                            {best}%
                          </p>
                          <p className="text-[9px] text-white/40 uppercase">
                            Attend all
                          </p>
                        </div>
                      </div>

                      {/* 💡 SMART INSIGHT */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                        <p className="text-[11px] font-bold text-white/60 uppercase mb-1">
                          Insight
                        </p>
                        <p className="text-sm text-white font-medium leading-relaxed">
                          {best >= target
                            ? "You can reach your target if you stay consistent."
                            : "You need to attend more classes to reach your target."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* IMPACT FORECAST */}
                <div className="bg-white border border-slate-100 rounded-[1.3rem] lg:rounded-[2.5rem] p-3 lg:p-8 shadow-sm">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-8">
                    <Calculator
                      className="text-indigo-600 w-5 h-5 md:w-[24px] md:h-[24px]"
                      strokeWidth={2}
                    />
                    <h2 className="text-sm lg:text-xl font-bold text-slate-900 tracking-tight">
                      Impact Forecast
                    </h2>
                  </div>

                  {/* Grid: 1 column on mobile (default), 2 columns on desktop (md breakpoint) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {/* Perfect Week Card */}
                    <div className="flex items-center justify-between p-3 md:p-6 bg-[#EFFFF6] border border-[#D1FADF]/50 rounded-[2rem]">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="p-2.5 md:p-3 bg-[#D1FADF] text-[#77bf9e] rounded-2xl shrink-0">
                          {/* Responsive Icon Size: 16px on mobile, 22px on desktop */}
                          <TrendingUp
                            className="w-4 h-4 md:w-[22px] md:h-[22px]"
                            strokeWidth={2.5}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base md:text-lg font-bold text-slate-900 leading-tight truncate">
                            Perfect {impactDays} Days
                          </p>
                          <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5">
                            Attend all classes
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[10px] md:text-sm font-bold text-slate-500">
                          {perfect.current}% → {perfect.next}%
                        </p>
                        <p className="text-2xl md:text-3xl font-black text-[#039855] tracking-tight">
                          +{perfect.diff}%
                        </p>
                      </div>
                    </div>

                    {/* Mass Bunk Card */}
                    <div className="flex items-center justify-between p-3 md:p-6 bg-[#FFF5F5] border border-[#FEE4E2]/50 rounded-[2rem]">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="p-2.5 md:p-3 bg-[#FEE4E2] text-[#D92D20] rounded-2xl shrink-0">
                          {/* Responsive Icon Size: 16px on mobile, 22px on desktop */}
                          <TrendingDown
                            className="w-4 h-4 md:w-[22px] md:h-[22px]"
                            strokeWidth={2.5}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base md:text-lg font-bold text-slate-900 leading-tight truncate">
                            Bunk {impactDays} Days
                          </p>
                          <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5">
                            Skip all classes
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[10px] md:text-sm font-bold text-slate-500">
                          {bunk.current}% → {bunk.next}%
                        </p>
                        <p className="text-2xl md:text-3xl font-black text-[#D92D20] tracking-tight">
                          {bunk.diff}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block bg-white border border-slate-100 rounded-[1.3rem] lg:rounded-[2.5rem] p-3 lg:p-10 md:p-10 shadow-sm">
                  {/* Header */}
                  <h2 className="text-lg md:text-xl font-black text-[#1e293b] mb-3  md:mb-10 tracking-tight">
                    Subject Overview
                  </h2>

                  {/* Cards Grid: Stays 1 col on mobile, 2 cols on lg (Desktop) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
                    {safeSubjects.map((sub, idx) => {
                      const attended = sub.attended_count || 0;
                      const conducted = sub.conducted_count || 0;

                      const percentage =
                        conducted > 0
                          ? ((attended / conducted) * 100).toFixed(1)
                          : "0.0";

                      const isLow = percentage < target;

                      const themes = [
                        {
                          bg: "bg-purple-50",
                          border: "border-purple-200",
                          text: "text-purple-700",
                          bar: "bg-purple-500",
                        },
                        {
                          bg: "bg-blue-50",
                          border: "border-blue-200",
                          text: "text-blue-700",
                          bar: "bg-blue-500",
                        },
                        {
                          bg: "bg-amber-50",
                          border: "border-amber-200",
                          text: "text-amber-700",
                          bar: "bg-amber-500",
                        },
                        {
                          bg: "bg-emerald-50",
                          border: "border-emerald-200",
                          text: "text-emerald-700",
                          bar: "bg-emerald-500",
                        },
                        {
                          bg: "bg-rose-50",
                          border: "border-rose-200",
                          text: "text-rose-700",
                          bar: "bg-rose-500",
                        },
                      ];

                      const theme = themes[idx % themes.length];

                      const safe = Math.floor(
                        (100 * attended) / target - conducted,
                      );
                      const need = Math.ceil(
                        (target * conducted - 100 * attended) / (100 - target),
                      );

                      return (
                        <div
                          key={sub._id}
                          className={`${theme.bg} border ${theme.border} rounded-[1.2rem] md:rounded-[2rem] p-3 md:p-8 relative overflow-hidden`}
                        >
                          {/* Header */}
                          <div className="flex justify-between items-start mb-4 md:mb-6">
                            <div className="flex items-baseline justify-center gap-2 lg:gap-0 lg:flex-col lg:items-start min-w-0 pr-0 lg:pr-4">
                              <h3
                                className={`${theme.text} font-black text-xs md:text-sm uppercase tracking-wider truncate`}
                              >
                                {sub.name}
                              </h3>
                              <p className="text-slate-400 text-[9px] md:text-[10px] font-bold mt-0 lg:mt-1">
                                ({sub.code || "No Code"})
                              </p>
                            </div>
                            {isLow && (
                              <span className="shrink-0 bg-red-100 text-red-600 text-[8px] font-black px-2 py-0.5 rounded border border-red-300 uppercase">
                                At Risk
                              </span>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="flex justify-between items-end mb-4">
                            <div className="shrink-0">
                              <p
                                className={`text-1xl md:text-4xl font-black ${theme.text} leading-none`}
                              >
                                {percentage}%
                              </p>
                              <p className="text-slate-400 text-[10px] md:text-[11px] font-bold mt-2">
                                {attended}/{conducted} classes
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                              {!isLow && safe > 0 && (
                                <span className="bg-white/60 text-emerald-600 text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-full border border-emerald-200 whitespace-nowrap">
                                  {safe} safe bunks
                                </span>
                              )}

                              {isLow && need > 0 && (
                                <span className="text-orange-500 text-[9px] md:text-[10px] font-black whitespace-nowrap">
                                  Need {need} classes
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-white border-1 border-fuchsia-400/20 h-1.5 md:h-2 rounded-full overflow-hidden">
                            <div
                              className={`${theme.bar} h-full rounded-full transition-all duration-500`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:hidden bg-white border border-slate-100 rounded-[1.3rem] lg:rounded-[2.5rem] p-4 md:p-10 shadow-sm">
                  {/* Header */}
                  <h2 className="text-lg md:text-xl font-black text-[#1e293b] mb-4 md:mb-10 tracking-tight">
                    Subject Overview
                  </h2>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
                    {safeSubjects.map((sub, idx) => {
                      const attended = sub.attended_count || 0;
                      const conducted = sub.conducted_count || 0;
                      const percentage =
                        conducted > 0
                          ? ((attended / conducted) * 100).toFixed(1)
                          : "0.0";
                      const isLow = percentage < target;

                      const themes = [
                        {
                          bg: "bg-purple-50",
                          border: "border-purple-200",
                          text: "text-purple-700",
                          bar: "bg-purple-500",
                        },
                        {
                          bg: "bg-blue-50",
                          border: "border-blue-200",
                          text: "text-blue-700",
                          bar: "bg-blue-500",
                        },
                        {
                          bg: "bg-amber-50",
                          border: "border-amber-200",
                          text: "text-amber-700",
                          bar: "bg-amber-500",
                        },
                        {
                          bg: "bg-emerald-50",
                          border: "border-emerald-200",
                          text: "text-emerald-700",
                          bar: "bg-emerald-500",
                        },
                        {
                          bg: "bg-rose-50",
                          border: "border-rose-200",
                          text: "text-rose-700",
                          bar: "bg-rose-500",
                        },
                      ];
                      const theme = themes[idx % themes.length];
                      const safe = Math.floor(
                        (100 * attended) / target - conducted,
                      );
                      const need = Math.ceil(
                        (target * conducted - 100 * attended) / (100 - target),
                      );

                      return (
                        <div
                          key={sub._id}
                          className={`${theme.bg} border ${theme.border} rounded-[1.2rem] md:rounded-[2rem] p-3 md:p-8 relative overflow-hidden`}
                        >
                          {/* MOBILE: Single line flex-row with 3 sections
              DESKTOP (lg): Original Stacked Layout
          */}
                          <div className="flex flex-row lg:flex-col justify-between items-center lg:items-stretch mb-2 lg:mb-6">
                            {/* Section 1: Subject Identity (Left) */}
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-baseline gap-1 lg:block">
                                <h3
                                  className={`${theme.text} font-black text-[11px] md:text-sm uppercase tracking-wider truncate`}
                                >
                                  {sub.name}
                                </h3>
                                <span className="text-slate-400 text-[8px] md:text-[10px] font-bold">
                                  {sub.code}
                                </span>
                              </div>
                              {/* Counts: Only visible on mobile here; on desktop it's in Section 2 */}
                              <p className="lg:hidden text-slate-400 text-[9px] font-bold">
                                {attended}/{conducted} classes
                              </p>
                            </div>

                            {/* Section 2: Attendance Stats (Center/Hidden on Desktop) */}
                            <div className="hidden lg:block">
                              <p className="text-slate-400 text-[11px] font-bold mt-1">
                                {attended}/{conducted} classes
                              </p>
                            </div>

                            {/* Section 3: Percentage & Status (Right) */}
                            <div className="flex flex-col items-end lg:flex-row lg:justify-between lg:items-end lg:mt-4 shrink-0">
                              {/* Percentage - Large and clear */}
                              <p
                                className={`text-xl lg:text-4xl font-black ${theme.text} leading-none`}
                              >
                                {percentage}%
                              </p>

                              {/* Status Badges Container */}
                              <div className="mt-1 lg:mt-0 flex items-center gap-1.5 lg:block">
                                {/* Safe Status */}
                                {!isLow && safe > 0 && (
                                  <span className="bg-white/60 text-emerald-600 text-[8px] lg:text-[10px] font-black px-2 lg:px-3 py-0.5 lg:py-1 rounded-full border border-emerald-200 whitespace-nowrap">
                                    Bunk {safe} classes safely
                                  </span>
                                )}

                                {/* Low/Need Status Group */}
                                {/* Low/Need Status Group - Styled like the Safe Message */}
                                {isLow && (
                                  <div className="flex items-center gap-1.5 lg:flex-col lg:items-end lg:gap-1">
                                    {need > 0 && (
                                      <span className="bg-orange-50/80 text-orange-600 text-[8px] lg:text-[10px] font-black px-2 lg:px-3 py-0.5 lg:py-1 rounded-full border border-orange-200 whitespace-nowrap">
                                        Need {need} classes to be safe
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar: Ultra slim on mobile */}
                          <div className="w-full bg-white h-1 lg:h-2 rounded-full overflow-hidden border-1 border-fuchsia-400/20">
                            <div
                              className={`${theme.bar} h-full rounded-full transition-all duration-500`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Attendance;
