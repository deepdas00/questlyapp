import React, { useState } from "react";
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Star,
  Target,
  Filter,
  MoreHorizontal,
  AlertCircle,
  Calendar as CalendarIcon,
  Hash,
  ArrowUpRight,
  Zap,
  Trophy,
  LayoutGrid,
  ListTodo,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const StudentTodo = () => {
  const [activeTab, setActiveTab] = useState("All Missions");
  const [completedTasks, setCompletedTasks] = useState([3]); // IDs of completed tasks

  const tasks = [
    {
      id: 1,
      title: "Finalize OS Threading Lab",
      course: "Operating Systems",
      due: "2h 15m left",
      priority: "High",
      category: "Assignment",
      points: 150,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      id: 2,
      title: "Read Chapter 4: B-Trees & AVL",
      course: "Data Structures",
      due: "Tomorrow",
      priority: "Medium",
      category: "Study",
      points: 45,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      id: 3,
      title: "Hackathon Team Sync",
      course: "GenDelta",
      due: "Today, 5:00 PM",
      priority: "Low",
      category: "Meeting",
      points: 20,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      id: 4,
      title: "UI Design for EduFlow",
      course: "Design Lab",
      due: "Wednesday",
      priority: "High",
      category: "Project",
      points: 300,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      id: 5,
      title: "Submit Physics Assignment",
      course: "Applied Physics",
      due: "Friday",
      priority: "Medium",
      category: "Submission",
      points: 80,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  const toggleTask = (id) => {
    setCompletedTasks((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <Sidebar />

      <main className="flex-1 h-screen overflow-y-auto p-4 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* --- TOP GLOBAL HEADER --- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-200">
                  D
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                  Deep <span className="text-blue-600">Dev</span>
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    Rank #4
                  </span>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    9.2 GPA Pace
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Quick search missions..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
              </div>
              <button className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 group">
                <Plus
                  size={24}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* --- LEFT: NAVIGATION & XP --- */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Growth Curve
                  </h3>
                  <Trophy size={16} className="text-amber-500" />
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-slate-400">Daily XP</span>
                      <span className="text-blue-600">1,240 / 2,000</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-400 h-full w-[62%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"></div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-orange-50 rounded-2xl p-4 text-center">
                      <Flame
                        className="text-orange-500 mx-auto mb-1"
                        size={18}
                      />
                      <p className="text-xl font-black text-slate-800">12</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase">
                        Streak
                      </p>
                    </div>
                    <div className="flex-1 bg-blue-50 rounded-2xl p-4 text-center">
                      <Zap className="text-blue-500 mx-auto mb-1" size={18} />
                      <p className="text-xl font-black text-slate-800">88%</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase">
                        Energy
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  {
                    name: "All Missions",
                    icon: <LayoutGrid size={18} />,
                    count: 12,
                  },
                  {
                    name: "Urgent",
                    icon: <AlertCircle size={18} />,
                    count: 2,
                    color: "text-red-500",
                  },
                  { name: "University", icon: <Hash size={18} />, count: 5 },
                  {
                    name: "Completed",
                    icon: <CheckCircle2 size={18} />,
                    count: 48,
                  },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black transition-all ${
                      activeTab === item.name
                        ? "bg-slate-900 text-white shadow-xl translate-x-2"
                        : "text-slate-400 hover:text-slate-600 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.name}
                    </div>
                    <span
                      className={`text-[10px] ${activeTab === item.name ? "text-blue-400" : "text-slate-300"}`}
                    >
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* --- MIDDLE: THE MISSION LIST --- */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">
                  Active Field Missions
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400">
                    <Filter size={16} />
                  </button>
                  <button className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group relative bg-white border ${completedTasks.includes(task.id) ? "border-slate-100 opacity-60" : "border-slate-100 hover:border-blue-400"} rounded-[2rem] p-6 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-slate-200/50`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTask(task.id);
                          }}
                          className="transition-transform active:scale-90"
                        >
                          {completedTasks.includes(task.id) ? (
                            <div className="bg-emerald-500 p-1 rounded-full text-white">
                              <CheckCircle2 size={24} />
                            </div>
                          ) : (
                            <Circle
                              size={28}
                              className="text-slate-200 group-hover:text-blue-400 transition-colors"
                            />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${task.bg} ${task.color}`}
                            >
                              {task.category}
                            </span>
                            <span className="text-slate-300 text-[8px] font-black uppercase">
                              • {task.priority}
                            </span>
                          </div>
                          <h4
                            className={`text-xl font-black text-slate-800 tracking-tight ${completedTasks.includes(task.id) ? "line-through" : ""}`}
                          >
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Clock
                                size={12}
                                className={
                                  task.priority === "High" ? "text-red-400" : ""
                                }
                              />
                              <span
                                className={`text-[10px] font-bold ${task.priority === "High" ? "text-red-500" : ""}`}
                              >
                                {task.due}
                              </span>
                            </div>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {task.course}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="hidden md:block text-right">
                        <div className="flex items-center gap-1 justify-end text-blue-600">
                          <Star size={12} fill="currentColor" />
                          <span className="text-lg font-black">
                            {task.points}
                          </span>
                        </div>
                        <p className="text-[8px] font-black text-slate-300 uppercase mt-1">
                          Reward XP
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- RIGHT: FOCUS & INTELLIGENCE --- */}
            <div className="lg:col-span-3 space-y-6">
              {/* Focus Module */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin-slow mb-6">
                    <Target size={32} className="text-blue-400" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Primary Objective
                  </p>
                  <h3 className="text-2xl font-black italic uppercase leading-tight tracking-tighter">
                    Finalize OS Threading
                  </h3>

                  <div className="mt-8 space-y-4">
                    <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40">
                      Engage Focus
                    </button>
                    <p className="text-[9px] font-bold text-slate-500 italic">
                      "This mission contributes 15% to your OS Grade."
                    </p>
                  </div>
                </div>
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-20"></div>
              </div>

              {/* Deadlines Bento */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                  Critical Path
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[8px] font-black">APR</span>
                      <span className="text-sm font-black leading-none">
                        28
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">
                        Midterm Viva
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        Lab Complex • 10AM
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[8px] font-black">MAY</span>
                      <span className="text-sm font-black leading-none">
                        02
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">
                        Project Beta
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        GenDelta Sync
                      </p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 py-3 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">
                  Sync Google Calendar
                </button>
              </div>

              {/* Insight Card */}
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={16} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase">
                    AI Insight
                  </span>
                </div>
                <p className="text-xs font-bold leading-relaxed">
                  "You're most productive between{" "}
                  <span className="text-blue-200">9 PM and 12 AM</span>.
                  Schedule your 'Design Lab' missions then for maximum XP."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default StudentTodo;
