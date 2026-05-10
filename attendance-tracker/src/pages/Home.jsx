import React from "react";
import { useEffect, useState } from "react";

import { 
  Zap, Flame, Target, AlertTriangle, LayoutGrid, Clock, 
  CheckCircle, Users, ChevronRight, TrendingUp, Box, Layers, 
  Bell, Search, Menu, ZapOff, Activity, Globe, Compass
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
const API = import.meta.env.VITE_API_URL;

const AeroWhiteDashboard = () => {
  
const [tasks, setTasks] = useState([]);
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(true);
const [attendance, setAttendance] = useState([]);


useEffect(() => {
  const fetchData = async () => {
    try {
      const [attRes, taskRes, projRes] = await Promise.all([
        fetch(`${API}/attendance`, { credentials: "include" }),
        fetch(`${API}/task`, { credentials: "include" }),
        fetch(`${API}/project-workspace`, { credentials: "include" }),
      ]);

      const attData = await attRes.json();
      const taskData = await taskRes.json();
      const projData = await projRes.json();

      setAttendance(attData);
      setTasks(taskData);
      setProjects(projData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);



const totalTasks = tasks.length;
const completedTasks = tasks.filter(t => t.completed).length;
const pendingTasks = totalTasks - completedTasks;

const completionRate =
  totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

const activeProjects = projects.length;



if (loading || !attendance) {
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

  data.forEach(day => {
    if (day.day_type === "HOLIDAY") return;

    day.slots?.forEach(slot => {
      total++;
      if (slot.status === "PRESENT") present++;
    });
  });

  const percent = total > 0 ? (present / total) * 100 : 0;

  return {
    percent: percent.toFixed(1),
    total,
    present,
    absent: total - present
  };
};

const getWeeklyComparison = (data = []) => {
  const today = new Date();

  const currentWeek = [];
  const lastWeek = [];

  data.forEach(day => {
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

const weekly = getWeeklyComparison(attendance);

const attendanceStats = calculateAttendance(attendance);
const attendancePercent = attendanceStats.percent;


  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />
      
      <div className="flex">
        {/* ===== SIDEBAR (Hidden on Mobile/Tablet) ===== */}
        <div className="hidden lg:block fixed h-full z-50">
          <Sidebar />
        </div>

        {/* ===== MAIN STAGE ===== */}
        {/* Adjusted padding for mobile (p-4) vs desktop (lg:p-16) */}

        
        <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-16 relative transition-all duration-500">
          
          {/* --- AMBIENT BLOOM --- */}
          <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-200/30 blur-[80px] md:blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[0%] left-[-5%] w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-indigo-100/40 blur-[60px] md:blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-[1600px] mx-auto relative z-10">
            
            {/* --- HERO HEADER --- */}
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-[3px] w-8 md:w-10 bg-blue-600 rounded-full" />
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-blue-600/80">System.Command.Live</p>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-950 italic leading-none">
                  Deep Workspace<span className="text-blue-600">.</span>
                </h1>
              </div>
              
              <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md border border-white p-2 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 self-start md:self-auto">
                <div className="flex items-center gap-3 pl-4 pr-2">
                  <div className="text-right">
                    <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Founder Mode</p>
                    <p className="text-[10px] md:text-xs font-bold text-slate-900">May 09, 2026</p>
                  </div>
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-950 rounded-xl md:rounded-[1.8rem] flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform cursor-pointer group">
                    <Activity size={18} className="text-blue-500 md:size-[22px] group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </header>

            {/* --- THE COMMAND GRID (Responsive Spanning) --- */}
            {/* Mobile: 1 col | Tablet: 2 cols | Desktop: 14 cols */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-14 gap-4 md:gap-6 lg:gap-8">
              
              {/* 1. ATTENDANCE MASTER */}
              <div className="col-span-1 md:col-span-2 lg:col-span-9 bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 lg:p-14 shadow-2xl shadow-slate-200/60 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex flex-col xl:flex-row justify-between items-start gap-8 mb-8 md:mb-12">
                    <div className="space-y-4">
                      <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Tactical Attendance</h2>
                      <div className="flex items-baseline gap-4 md:gap-6">
                        <span className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-950 tracking-tighter leading-none">{attendancePercent}<span className="text-blue-600/10">%</span></span>
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
                          <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tighter">vs last week</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full xl:w-64 space-y-3 md:space-y-4">
                       <h3 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Health</h3>
                       <div className="space-y-3">
                          <InsightBar label="OS" val={72} color="bg-blue-500" />
                          <InsightBar label="DBMS" val={88} color="bg-emerald-500" />
                          <InsightBar label="TOC" val={45} color="bg-red-500" />
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8">
                 <MetricBox label="Tasks Done" val={completedTasks} sub="Completed" />
<MetricBox label="Pending" val={pendingTasks} sub="Tasks" />
<MetricBox label="Focus" val={`${completionRate}%`} sub="Efficiency" />
<MetricBox label="Projects" val={activeProjects} sub="Active" />
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-5 md:opacity-10 pointer-events-none">
                   <Globe className="size-32 md:size-48 lg:size-[200px] text-slate-900 rotate-12" />
                </div>
              </div>

              {/* 2. TASKIFY RADAR */}
              <div className="col-span-1 lg:col-span-5 bg-white border border-slate-200 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 shadow-xl shadow-slate-200/40">
                <div className="flex justify-between items-center mb-8 md:mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600">
                      <Layers size={18} />
                    </div>
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-900">Taskify.Core</span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                </div>
                
                <div className="space-y-4 md:space-y-5">
                  {tasks.slice(0, 4).map((task) => (
  <TaskRow
    key={task._id}
    title={task.title}
    type="Task"
    due={new Date(task.dueDate).toLocaleDateString()}
    status={task.completed ? "Done" : "Active"}
  />
))}
                </div>

                <button className="w-full mt-8 md:mt-10 py-4 md:py-5 bg-slate-950 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all active:scale-95">
                  Expand Workspace
                </button>
              </div>

              {/* 3. CRITICAL DEFENSE UNIT */}
              <div className="col-span-1 lg:col-span-5 bg-red-600 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-red-200">
                 <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6 md:mb-8">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-xl rounded-xl md:rounded-2xl flex items-center justify-center">
                        <AlertTriangle size={20} md:size={24} fill="white" className="text-red-600" />
                      </div>
                      <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-red-100">Defense Protocol</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-3 italic underline decoration-white/30 underline-offset-8">Theory of Computation</h3>
                    <p className="text-red-100/70 text-[10px] md:text-xs font-medium mb-8 md:mb-10">Attendance 45.2%. Missed sessions trigger mandatory review.</p>
                    
                    <button className="w-full bg-white text-red-600 py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-[10px] md:text-[11px] uppercase tracking-widest shadow-xl hover:bg-red-50 transition-all">
                      Log Attendance
                    </button>
                 </div>
                 <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 opacity-10">
                    <ZapOff size={180} md:size={240} />
                 </div>
              </div>

              {/* 4. FOUNDATION: TEAM DELTA */}
              <div className="col-span-1 md:col-span-2 lg:col-span-9 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-14 text-white relative overflow-hidden">
                 <div className="relative z-10 flex flex-col h-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-8 md:mb-12">
                       <div>
                          <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <Compass size={16} className="text-blue-500" />
                            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400">Venture / Project Delta</p>
                          </div>
                          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter italic">Fintech Alpha v1.0</h3>
                       </div>
                       
                       <div className="flex -space-x-3 md:-space-x-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-[1.5rem] border-2 md:border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black ring-2 ring-blue-500/20">D</div>
                          ))}
                          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-[1.5rem] border-2 md:border-4 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-black">+2</div>
                       </div>
                    </div>

                    <div className="mt-auto grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
                       <ProjectStat label="Projects" val={projects.length} />
<ProjectStat label="Pending Tasks" val={pendingTasks} />
<ProjectStat label="Completion" val={`${completionRate}%`} />
                       <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] flex items-center justify-between">
                          <div>
                            <p className="text-[9px] md:text-[10px] font-black uppercase text-blue-500 mb-1">Sprint</p>
                            <p className="text-2xl md:text-3xl font-black italic tracking-tighter">88%</p>
                          </div>
                          <ChevronRight className="text-slate-600" />
                       </div>
                    </div>
                 </div>
              </div>

              {/* 5. CURRENT SCHEDULE */}
              <div className="col-span-1 md:col-span-2 lg:col-span-14 bg-white border border-slate-200 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 lg:p-14 shadow-sm flex flex-col xl:flex-row items-center gap-8 md:gap-12">
                 <div className="flex-shrink-0 text-center xl:text-left w-full xl:w-auto">
                    <p className="text-[10px] md:text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Ongoing Sequence</p>
                    <h4 className="text-2xl md:text-4xl font-black text-slate-950 tracking-tighter italic leading-none">Database Management Lab</h4>
                    <p className="text-xs md:text-sm font-bold text-slate-400 mt-3 md:mt-4 uppercase tracking-widest">Lab 02 • Station 12</p>
                 </div>
                 
                 <div className="hidden xl:block h-20 w-[1px] bg-slate-100" />
                 
                 <div className="flex-1 w-full space-y-4 md:space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                       <div className="flex gap-3 md:gap-4">
                          <TimeTag time="11:00 AM" label="Start" />
                          <TimeTag time="01:30 PM" label="End" />
                       </div>
                       <span className="text-[10px] md:text-[11px] font-black text-blue-600 uppercase tracking-widest">45m Left</span>
                    </div>
                    <div className="w-full h-3 md:h-4 bg-slate-50 rounded-full p-0.5 md:p-1 border border-slate-100">
                       <div className="bg-blue-600 h-full w-[65%] rounded-full shadow-lg shadow-blue-200 transition-all duration-1000" />
                    </div>
                 </div>
              </div>




            </div>
          </div>

<p className="text-sm text-slate-400">{insight}</p>
        </main>
      </div>
    </div>
  );
};

// --- ELITE SUB-COMPONENTS (Responsive versions) ---

const InsightBar = ({ label, val, color }) => (
  <div className="flex items-center gap-3">
    <span className="text-[9px] md:text-[10px] font-black text-slate-400 w-7 md:w-8">{label}</span>
    <div className="flex-1 h-1 md:h-1.5 bg-slate-50 rounded-full overflow-hidden">
      <div className={`${color} h-full rounded-full transition-all duration-1000`} style={{ width: `${val}%` }} />
    </div>
    <span className="text-[9px] md:text-[10px] font-bold text-slate-900">{val}%</span>
  </div>
);

const MetricBox = ({ label, val, sub, color = "text-slate-950" }) => (
  <div className="space-y-0.5 md:space-y-1">
    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className={`text-2xl md:text-4xl font-black tracking-tighter ${color}`}>{val}</p>
    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase leading-none">{sub}</p>
  </div>
);

const TaskRow = ({ title, type, due, status }) => (
  <div className="flex items-center justify-between p-3 md:p-4 hover:bg-slate-50 rounded-2xl md:rounded-[1.8rem] transition-all cursor-pointer group border border-transparent hover:border-slate-100">
    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
      <div className={`flex-shrink-0 w-2 h-2 rounded-full ${status === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`} />
      <div className="overflow-hidden">
        <h5 className="text-[11px] md:text-sm font-bold text-slate-800 truncate leading-none mb-1">{title}</h5>
        <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{type}</span>
      </div>
    </div>
    <div className="text-right flex-shrink-0 ml-2 md:ml-4">
      <p className="text-[9px] md:text-[10px] font-black text-slate-900 tracking-tighter">{due}</p>
    </div>
  </div>
);

const ProjectStat = ({ label, val }) => (
  <div className="bg-white/5 border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-[2.5rem]">
    <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 mb-0.5 md:mb-1">{label}</p>
    <p className="text-lg md:text-xl font-bold italic tracking-tight">{val}</p>
  </div>
);

const TimeTag = ({ time, label }) => (
  <div className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
    <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5 md:mb-1">{label}</p>
    <p className="text-[10px] md:text-xs font-black text-slate-900">{time}</p>
  </div>
);

export default AeroWhiteDashboard;