import React from "react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  Zap,
  Flame,
  Target,
  AlertTriangle,
  LayoutGrid,
  Clock,
  CheckCircle,
  Users,
  ChevronRight,
  TrendingUp,
  Box,
  Layers,
  Bell,
  Search,
  Menu,
  ZapOff,
  Activity,
  Globe,
  Compass,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
const API = import.meta.env.VITE_API_URL;
import { useApp } from "../context/AppContext";
import { AuthContext } from "../context/AuthContext";

const AeroWhiteDashboard = () => {
  const { user } = useContext(AuthContext);
 

  const navigate = useNavigate();
  const { dashboardData, setDashboardData } = useApp();

  const subjects = dashboardData?.subjects || [];
  const semester = dashboardData?.semester || null;
  const attendanceData = dashboardData?.attendance || [];
  const tasks = dashboardData?.tasks || [];
  const projects = dashboardData?.projects || [];

  const fetchData = async () => {
    try {
      const [attRes, taskRes, projRes, subRes, semRes] =
        await Promise.all([
          fetch(`${API}/attendance`, { credentials: "include" }),
          fetch(`${API}/task`, { credentials: "include" }),
          fetch(`${API}/project-workspace`, { credentials: "include" }),
          fetch(`${API}/subject`, { credentials: "include" }),
          fetch(`${API}/semester/active`, { credentials: "include" }),
          
        ]);

      const attData = await attRes.json();
      const taskData = await taskRes.json();
      const projData = await projRes.json();
      const subData = await subRes.json();
      const semData = await semRes.json();
   
      // 🔥 SAVE EVERYTHING
      setDashboardData({
        attendance: attData,
        tasks: taskData,
        projects: projData,
        subjects: subData,
        semester: semData,
       
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completedAt !== null).length;

  const pendingTasks = tasks.filter((t) => t.completedAt === null).length;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const activeProjects = projects.length;

  if (!dashboardData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-slate-400 font-bold">Loading Dashboard...</p>
      </div>
    );
  }

  const insight =
    completionRate > 70
      ? "🔥 Great consistency! Keep pushing."
      : completionRate > 40
        ? "⚡ You’re getting there, don’t slow down."
        : "⚠️ You need to focus more today.";

  const calculateAttendance = (data = []) => {
    let total = 0;
    let present = 0;

    data.forEach((day) => {
      if (day.day_type === "HOLIDAY") return;

      day.slots?.forEach((slot) => {
        total++;
        if (slot.status === "PRESENT") present++;
      });
    });

    const percent = total > 0 ? (present / total) * 100 : 0;

    return {
      percent: percent.toFixed(1),
      total,
      present,
      absent: total - present,
    };
  };

  const getWeeklyComparison = (data = []) => {
    const today = new Date();

    const currentWeek = [];
    const lastWeek = [];

    data.forEach((day) => {
      const d = new Date(day.date);
      const diffDays = Math.floor((today - d) / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) currentWeek.push(day);
      else if (diffDays > 7 && diffDays <= 14) lastWeek.push(day);
    });

    const currentStats = calculateAttendance(currentWeek);
    const lastStats = calculateAttendance(lastWeek);

    const diff =
      parseFloat(currentStats.percent) - parseFloat(lastStats.percent);

    return {
      diff: diff.toFixed(1),
      isUp: diff >= 0,
    };
  };

  const weekly = getWeeklyComparison(attendanceData);

  const attendanceStats = calculateAttendance(attendanceData);
  const attendancePercent = attendanceStats.percent;

  const getSubjectStats = (attendance = []) => {
    const map = {};

    attendance.forEach((day) => {
      if (day.day_type === "HOLIDAY") return;

      day.slots?.forEach((slot) => {
        const name = slot.subject_id?.name || "Unknown";

        if (!map[name]) {
          map[name] = { total: 0, present: 0 };
        }

        map[name].total++;

        if (slot.status === "PRESENT") {
          map[name].present++;
        }
      });
    });

    return Object.entries(map).map(([name, data]) => ({
      name,
      percent: data.total > 0 ? (data.present / data.total) * 100 : 0,
    }));
  };

  const getDangerSubjects = (attendance = []) => {
    const subjects = getSubjectStats(attendance);

    return subjects
      .sort((a, b) => a.percent - b.percent) // lowest first
      .slice(0, 2); // max 2 subjects
  };

  const dangerSubjects = getDangerSubjects(attendanceData);

  const getSubjectAttendance = (attendance = [], subjects = []) => {
    const map = {};

    attendance.forEach((day) => {
      if (day.day_type === "HOLIDAY") return;

      day.slots?.forEach((slot) => {
        const subId = slot.subject_id?._id || slot.subject_id;

        if (!subId) return;

        if (!map[subId]) {
          map[subId] = { total: 0, present: 0 };
        }

        map[subId].total++;

        if (slot.status === "PRESENT") {
          map[subId].present++;
        }
      });
    });

    return subjects.map((sub) => {
      const data = map[sub._id] || { total: 0, present: 0 };

      const percent = data.total > 0 ? (data.present / data.total) * 100 : 0;

      return {
        name: sub.name,
        percent,
      };
    });
  };

  const safeSubjects = subjects || [];
  const safeSemester = semester || null;

  const currentSubjects = subjects.filter(
    (sub) =>
      String(sub.semester_id?._id || sub.semester_id) === String(semester?._id),
  );

  const subjectHealth = getSubjectAttendance(attendanceData, currentSubjects);

  const getColor = (percent) => {
    if (percent < 60) return "bg-red-500";
    if (percent < 75) return "bg-orange-400";
    return "bg-emerald-500";
  };

  const today = new Date().toDateString();

  const todayData = attendanceData.find(
    (d) => new Date(d.date).toDateString() === today,
  );

  const todayPercent =
    todayData && todayData.slots?.length > 0
      ? (
          (todayData.slots.filter((s) => s.status === "PRESENT").length /
            todayData.slots.length) *
          100
        ).toFixed(0)
      : 0;

  const weeklyStats = getWeeklyComparison(attendanceData);

  const weeklyChange = weeklyStats.diff;
  const trend = weeklyStats.isUp ? "↑" : "↓";

  const riskSubjects = subjectHealth.filter((s) => s.percent < 75).length;

  const totalClasses = attendanceData.reduce((acc, day) => {
    return acc + (day.slots?.length || 0);
  }, 0);

  const attendedClasses = attendanceData.reduce((acc, day) => {
    return acc + (day.slots?.filter((s) => s.status === "PRESENT").length || 0);
  }, 0);

  const missedClasses = attendanceData.reduce((acc, day) => {
    return acc + (day.slots?.filter((s) => s.status === "ABSENT").length || 0);
  }, 0);

  const sortedTasks = [...tasks].sort((a, b) => {
    // Pending first
    if (!a.completedAt && b.completedAt) return -1;
    if (a.completedAt && !b.completedAt) return 1;

    // Optional: latest first
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const visibleTasks = sortedTasks.slice(0, 4);

  const pendingTasksList = tasks.filter((t) => !t.completedAt);
  const completedTasksList = tasks.filter((t) => t.completedAt);

  const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();

    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const todayTasks = tasks.filter((t) => isToday(t.createdAt));

  const pendingToday = todayTasks.filter((t) => !t.completedAt);
  const completedToday = todayTasks.filter((t) => t.completedAt);

  const maxTasks = 4;

  const visiblePending = pendingToday.slice(0, maxTasks);
  const remainingSlots = maxTasks - visiblePending.length;

  const visibleCompleted = completedToday.slice(0, remainingSlots);



  return (
  <div>

    <Navbar/>


      <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      

      <div className="flex">
        <div className="hidden lg:block fixed h-full z-50">
          <Sidebar />
        </div>

        <main className="flex-1 lg:ml-64 p-3 md:p-8 lg:p-16 relative transition-all duration-500">
          <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-200/30 blur-[80px] md:blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[0%] left-[-5%] w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-indigo-100/40 blur-[60px] md:blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-[1600px] mx-auto relative z-10">
            {/* --- HERO HEADER --- */}
            <header className="flex flex-row md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-[2px] md:h-[3px] w-8 md:w-10 bg-blue-600 rounded-full" />
                  <p className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.5em] text-blue-600/80">
                    System.Command.Live
                  </p>
                </div>
                <h1 className="text-xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-950 italic leading-none">
                  {user?.name?.split(" ")[0]} Workspace
                  <span className="text-blue-600">.</span>
                </h1>
              </div>

              <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md border border-white p-2 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 self-start md:self-auto">
                <div className="flex items-center gap-3 pl-1 md:pl-4 md:pr-2">
                  <div className="text-right">
                    <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Founder Mode
                    </p>
                    <p className="text-[10px] md:text-xs font-bold text-slate-900">
                      May 09, 2026
                    </p>
                  </div>
                  <div className="w-8 h-8 md:w-14 md:h-14 bg-slate-950 rounded-xl md:rounded-[1.8rem] flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform cursor-pointer group">
                    <Activity
                      size={18}
                      className="text-blue-500 md:size-[22px] group-hover:scale-110 transition-transform"
                    />
                  </div>
                </div>
              </div>
            </header>

            {/* --- THE COMMAND GRID (Responsive Spanning) --- */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-14 gap-4 md:gap-6 lg:gap-8">
              {/* 1. ATTENDANCE MASTER */}
              <div className="col-span-1 md:col-span-2 lg:col-span-9 bg-white/80 backdrop-blur-2xl border border-white rounded-[1.3rem] md:rounded-[4rem] p-4 md:p-10 lg:p-14 shadow-2xl shadow-slate-200/60 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex flex-col xl:flex-row justify-between items-start gap-8 mb-8 md:mb-12">
                    <div className="space-y-4">
                      <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Tactical Attendance
                      </h2>
                      <div className="flex items-baseline gap-4 md:gap-6">
                        <span className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-950 tracking-tighter leading-none">
                          {attendancePercent}
                          <span className="text-blue-600/10">%</span>
                        </span>
                        <div className="flex flex-col gap-1">
                          <div
                            className={`flex items-center gap-1 font-black text-[10px] md:text-xs px-2 md:px-3 py-1 rounded-full border ${
                              weekly.isUp
                                ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                                : "text-red-600 bg-red-50 border-red-100"
                            }`}
                          >
                            {weekly.isUp ? (
                              <TrendingUp size={10} />
                            ) : (
                              <TrendingUp size={10} className="rotate-180" />
                            )}
                            {weekly.isUp ? "+" : ""}
                            {weekly.diff}%
                          </div>
                          <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            vs last week
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full xl:w-64 space-y-3 md:space-y-4">
                      <h3 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Subject Health
                      </h3>
                      <div className="space-y-3">
                        {subjectHealth.length === 0 ? (
                          <p className="text-xs text-slate-400">
                            No subject data
                          </p>
                        ) : (
                          subjectHealth.map((sub, i) => (
                            <InsightBar
                              key={i}
                              label={sub.name}
                              val={Math.round(sub.percent)}
                              color={getColor(sub.percent)}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 ">
                    <MetricBox
                      label="Classes attend"
                      val={`${attendedClasses}`}
                      sub={`out of ${totalClasses}`}
                    />

                    <MetricBox
                      label="Trend"
                      val={`${weeklyStats.isUp ? "+" : ""}${weeklyStats.diff}%`}
                      sub={`Weekly ${trend}`}
                    />

                    <MetricBox label="Risk" val={riskSubjects} sub="Subjects" />

                    <MetricBox
                      label="Missed"
                      val={missedClasses}
                      sub="Classes ⚠️"
                    />
                  </div>

                  <div className="mt-8 md:mt-10 flex justify-center">
                    <button
                      onClick={() => navigate("/attendance")}
                      className="px-26 md:px-8 py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95"
                    >
                      View Attendance
                    </button>
                  </div>
                </div>

                <div className="absolute top-0 right-0 p-3 md:p-8 opacity-5 md:opacity-10 pointer-events-none">
                  <Globe className="size-22 md:size-48 lg:size-[200px] text-slate-900 rotate-12" />
                </div>
              </div>

              {/* 2. TASKIFY RADAR */}
              <div className="col-span-1 lg:col-span-5 bg-white border border-slate-200 rounded-[1.3rem] md:rounded-[4rem] p-4 md:p-10 shadow-xl shadow-slate-200/40">
                <div className="flex justify-between items-center mb-8 md:mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600">
                      <Layers size={18} />
                    </div>
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-900">
                      Taskify.Core
                    </span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                </div>

                <div className="space-y-4 md:space-y-5">
                  {visiblePending.length > 0 && (
                    <>
                      <p className="text-[9px] font-black uppercase tracking-widest text-red-500">
                        Pending ({pendingToday.length})
                      </p>

                      {visiblePending.map((task) => (
                        <TaskRow
                          key={task._id}
                          title={task.title}
                          type="Task"
                          due="PENDING"
                          status="ACTIVE"
                        />
                      ))}
                    </>
                  )}

                  {/* 🟢 Completed Today */}
                  {visibleCompleted.length > 0 && (
                    <>
                      <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mt-2">
                        Completed ({completedToday.length})
                      </p>

                      {visibleCompleted.map((task) => (
                        <TaskRow
                          key={task._id}
                          title={task.title}
                          type="Task"
                          due="DONE"
                          status="DONE"
                        />
                      ))}
                    </>
                  )}

                  {/* ❌ No tasks */}
                  {todayTasks.length === 0 && (
                    <p className="text-xs text-slate-400">No tasks for today</p>
                  )}
                </div>

                <button
                  onClick={() => navigate("/live-schedule")}
                  className="w-full mt-5 md:mt-10 py-4 md:py-5 bg-slate-950 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all active:scale-95"
                >
                  View More →
                </button>
              </div>

              {/* 3. CRITICAL DEFENSE UNIT */}
              <div className="col-span-1 lg:col-span-5 bg-[#0f172a] rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-200 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="text-red-800" size={20} />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold">
                        Defense Protocol
                      </p>
                      <p className="text-sm font-black text-white">
                        Attendance Risk Monitor
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-white/90 font-bold">
                    {dangerSubjects.length} Alert
                  </span>
                </div>

                {/* Subjects */}
                <div className="space-y-4">
                  {dangerSubjects.map((sub, index) => {
                    const percent = sub.percent;

                    const color =
                      percent < 60
                        ? {
                            text: "text-red-400",
                            bar: "bg-red-500",
                            glow: "shadow-red-500/30",
                            label: "Critical ⚠️",
                          }
                        : percent < 75
                          ? {
                              text: "text-orange-400",
                              bar: "bg-orange-400",
                              glow: "shadow-orange-400/30",
                              label: "Warning ⚡",
                            }
                          : {
                              text: "text-green-400",
                              bar: "bg-green-400",
                              glow: "shadow-green-400/30",
                              label: "Safe ✅",
                            };

                    return (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:scale-[1.02] transition-all"
                      >
                        {/* Left */}
                        <div>
                          <h3 className="text-white font-black text-lg">
                            {sub.name}
                          </h3>

                          <p className="text-xs text-white/60 mt-1">
                            {color.label}
                          </p>
                        </div>

                        {/* Right */}
                        <div className="text-right">
                          <div className={`text-lg font-black ${color.text}`}>
                            {percent.toFixed(1)}%
                          </div>

                          {/* Progress bar */}
                          <div className="w-24 h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                            <div
                              className={`h-full ${color.bar} ${color.glow}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate("/attendance")}
                  className="mt-6 w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-all active:scale-95"
                >
                  TAKE ACTION
                </button>
              </div>

              {/* 4. FOUNDATION: TEAM DELTA */}
              <div className="col-span-1 md:col-span-2 lg:col-span-9 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-14 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-8 md:mb-12">
                    <div>
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <Compass size={16} className="text-blue-500" />
                        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400">
                          Venture / Project Delta
                        </p>
                      </div>
                      <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter italic">
                        Fintech Alpha v1.0
                      </h3>
                    </div>

                    <div className="flex -space-x-3 md:-space-x-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-[1.5rem] border-2 md:border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black ring-2 ring-blue-500/20"
                        >
                          D
                        </div>
                      ))}
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-[1.5rem] border-2 md:border-4 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-black">
                        +2
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
                    <ProjectStat label="Projects" val={projects.length} />
                    <ProjectStat label="Pending Tasks" val={pendingTasks} />
                    <ProjectStat
                      label="Completion"
                      val={`${completionRate}%`}
                    />
                    <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] flex items-center justify-between">
                      <div>
                        <p className="text-[9px] md:text-[10px] font-black uppercase text-blue-500 mb-1">
                          Sprint
                        </p>
                        <p className="text-2xl md:text-3xl font-black italic tracking-tighter">
                          88%
                        </p>
                      </div>
                      <ChevronRight className="text-slate-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. CURRENT SCHEDULE */}

            </div>
          </div>

          <p className="text-sm text-slate-400">{insight}</p>
        </main>
      </div>
    </div>
  </div>
  );
};

// --- ELITE SUB-COMPONENTS (Responsive versions) ---

const InsightBar = ({ label, val, color }) => (
  <div className="flex items-center gap-3">
    <span className="text-[9px] md:text-[10px] font-black text-slate-400 w-20 md:w-18 break-words leading-tight">
      {label}
    </span>
    <div className="flex-1 h-1 md:h-1.5 bg-slate-50 rounded-full overflow-hidden">
      <div
        className={`${color} h-full rounded-full transition-all duration-1000`}
        style={{ width: `${val}%` }}
      />
    </div>
    <span className="text-[9px] md:text-[10px] font-bold text-slate-900">
      {val}%
    </span>
  </div>
);

const MetricBox = ({ label, val, sub, color = "text-slate-950" }) => (
  <div className="space-y-0.5 md:space-y-1">
    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {label}
    </p>
    <p className={`text-2xl md:text-4xl font-black tracking-tighter ${color}`}>
      {val}
    </p>
    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase leading-none">
      {sub}
    </p>
  </div>
);

const TaskRow = ({ title, type, due, status }) => (
  <div
    className={`flex items-center justify-between p-3 md:p-4 rounded-2xl md:rounded-[1.8rem] transition-all cursor-pointer group border border-transparent hover:border-slate-100 ${status != "DONE" ? "bg-red-100 hover:bg-red-200" : "bg-emerald-100 hover:bg-emerald-200"}`}
  >
    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
      <div
        className={`flex-shrink-0 w-2 h-2 rounded-full ${status != "DONE" ? "bg-red-500 animate-pulse" : "bg-emerald-500 "}`}
      />
      <div className="overflow-hidden">
        <h5 className="text-[11px] md:text-sm font-bold text-slate-800 truncate leading-none mb-1">
          {title}
        </h5>
        <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
          {type}
        </span>
      </div>
    </div>
    <div className="text-right flex-shrink-0 ml-2 md:ml-4">
      <p className="text-[9px] md:text-[10px] font-black text-slate-900 tracking-tighter">
        {due}
      </p>
    </div>
  </div>
);

const ProjectStat = ({ label, val }) => (
  <div className="bg-white/5 border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-[2.5rem]">
    <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 mb-0.5 md:mb-1">
      {label}
    </p>
    <p className="text-lg md:text-xl font-bold italic tracking-tight">{val}</p>
  </div>
);

const TimeTag = ({ time, label }) => (
  <div className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
    <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5 md:mb-1">
      {label}
    </p>
    <p className="text-[10px] md:text-xs font-black text-slate-900">{time}</p>
  </div>
);

export default AeroWhiteDashboard;
