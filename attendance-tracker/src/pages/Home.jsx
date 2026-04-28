import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckSquare,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  Flame,
  ArrowUpRight,
  Clock,
  Target,
  CreditCard,
} from "lucide-react";

const Home = () => {
  // Logic synced with your attendance stats
  const attendanceStats = {
    overall: 66.8,
    required: 17,
    status: "At Risk",
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex">
      {/* Sidebar - Quick Navigation */}
     <Sidebar/>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              Welcome back, Deep
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Saturday, 25 April 2026
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl border-2 border-white shadow-sm"></div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Attendance Pulse Card (Synced with SmartCompass) */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-slate-200/50">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="bg-red-50 text-red-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-red-100">
                    {attendanceStats.status}
                  </span>
                  <h3 className="text-4xl font-black mt-4 text-slate-800">
                    {attendanceStats.overall}%{" "}
                    <span className="text-sm text-slate-400 font-normal">
                      Attendance
                    </span>
                  </h3>
                </div>
                <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors">
                  <ArrowUpRight size={24} />
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-bold uppercase">
                    Recovery
                  </p>
                  <p className="text-lg font-black text-slate-800">
                    Attend {attendanceStats.required} more
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Bunk Status
                  </p>
                  <p className="text-lg font-black text-slate-800">
                    0 Safe Bunks
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center justify-center">
                  <button className="text-orange-600 font-black text-xs flex items-center gap-2">
                    <Flame size={14} /> TRIGGER MASS BUNK
                  </button>
                </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:bg-blue-100 transition-colors"></div>
            </div>

            {/* Quick Actions Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-blue-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">
                      Library Card
                    </h4>
                    <p className="text-sm text-slate-400">2 Overdue Books</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-blue-500" />
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-blue-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <CheckSquare size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">
                      Project Camp
                    </h4>
                    <p className="text-sm text-slate-400">4 Tasks Pending</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-blue-500" />
              </div>
            </div>
          </div>

          {/* Right Sidebar: Schedule & Deadlines */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <Clock size={20} className="text-blue-400" />
                <h3 className="font-black uppercase text-xs tracking-widest">
                  Upcoming Class
                </h3>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase">
                Starts in 15 mins
              </p>
              <h4 className="text-xl font-black mt-1">Operating Systems</h4>
              <p className="text-slate-500 text-sm">Room 402 • Prof. Sharma</p>

              <button className="w-full mt-6 bg-blue-600 py-3 rounded-2xl font-bold text-sm hover:bg-blue-500 transition-all">
                Mark Proxy (Beta)
              </button>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem]">
              <h3 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-6">
                Active Deadlines
              </h3>
              <div className="space-y-6">
                {[
                  {
                    title: "DBMS Assignment",
                    date: "Tomorrow",
                    color: "bg-red-500",
                  },
                  {
                    title: "Chess Hub UI Design",
                    date: "27 April",
                    color: "bg-blue-500",
                  },
                  {
                    title: "GenDelta Hackathon",
                    date: "01 May",
                    color: "bg-orange-500",
                  },
                ].map((task, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className={`w-1 h-10 rounded-full ${task.color}`}
                    ></div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-800">
                        {task.title}
                      </h5>
                      <p className="text-xs text-slate-400">{task.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
