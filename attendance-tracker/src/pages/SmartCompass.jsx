import React, { useState } from 'react';
import { 
  Target, Flame, AlertTriangle, CheckCircle2, 
  Info, TrendingUp, Filter, RotateCcw, BookOpen
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const SmartCompass = () => {
  const [targetThreshold] = useState(75);

  const subjects = [
    { id: 1, name: 'Operating Systems', attended: 12, total: 18, teacher: 'Prof. Sharma' },
    { id: 2, name: 'DBMS', attended: 22, total: 24, teacher: 'Dr. Reddy' },
    { id: 3, name: 'Data Structures', attended: 15, total: 25, teacher: 'Prof. Gupta' },
    { id: 4, name: 'Computer Networks', attended: 19, total: 22, teacher: 'Prof. Verma' },
    { id: 5, name: 'Theory of Computation', attended: 8, total: 14, teacher: 'Dr. Singh' },
  ];

  const calculateStats = (attended, total) => {
    const percentage = ((attended / total) * 100).toFixed(1);
    const isSafe = percentage >= targetThreshold;
    
    let required = 0;
    if (!isSafe) {
      required = Math.ceil((targetThreshold * total - 100 * attended) / (100 - targetThreshold));
    }

    let safeToBunk = 0;
    if (isSafe) {
      safeToBunk = Math.floor((100 * attended - targetThreshold * total) / targetThreshold);
    }

    return { percentage, isSafe, required, safeToBunk };
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* 1. PERMANENT SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 h-screen overflow-y-auto p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                <Target size={14} /> Attendance Intelligence
              </div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">Smart Compass</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Live Tracking & Recovery Analysis</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
               <div className="px-4 py-2">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Goal</p>
                 <p className="text-xl font-black text-blue-600">{targetThreshold}%</p>
               </div>
               <div className="w-[1px] h-10 bg-slate-100"></div>
               <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
                 <RotateCcw size={14} /> Recalculate
               </button>
            </div>
          </header>

          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <SummaryCard 
              title="Overall Pulse" 
              value="71.4%" 
              status="At Risk" 
              color="red" 
              icon={TrendingUp} 
            />
            <SummaryCard 
              title="Total Recovery" 
              value="12 Classes" 
              status="Needed" 
              color="blue" 
              icon={CheckCircle2} 
            />
            <SummaryCard 
              title="Mass Bunk" 
              value="3 Active" 
              status="Coordination" 
              color="orange" 
              icon={Flame} 
            />
          </div>

          {/* Subject Detail Table */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <BookOpen size={16} /> Subject-Wise Navigation
              </h3>
              <button className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-100 rounded-lg shadow-sm">
                <Filter size={18}/>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50">
                    <th className="px-8 py-5">Subject</th>
                    <th className="px-8 py-5">Attendance</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Action Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {subjects.map((sub) => {
                    const stats = calculateStats(sub.attended, sub.total);
                    return (
                      <tr key={sub.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{sub.name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{sub.teacher}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <span className={`text-lg font-black ${stats.isSafe ? 'text-emerald-600' : 'text-red-500'}`}>
                              {stats.percentage}%
                            </span>
                            <span className="text-[10px] font-bold text-slate-300">
                              ({sub.attended}/{sub.total})
                            </span>
                          </div>
                          <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${stats.isSafe ? 'bg-emerald-500' : 'bg-red-500'}`}
                              style={{ width: `${stats.percentage}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {stats.isSafe ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase">
                              <CheckCircle2 size={14} /> Safe Zone
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-red-500 font-black text-[10px] uppercase animate-pulse">
                              <AlertTriangle size={14} /> Below Limit
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          {stats.isSafe ? (
                            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase border border-emerald-100">
                              Can Bunk {stats.safeToBunk} Classes
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 bg-red-50 text-red-700 rounded-lg text-[10px] font-black uppercase border border-red-100 shadow-sm">
                              Attend {stats.required} Classes
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Informational Footer */}
          <div className="mt-8 p-8 bg-blue-600 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-200 relative overflow-hidden">
             <div className="flex items-center gap-4 relative z-10">
               <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md"><Info size={24} /></div>
               <div>
                 <p className="text-lg font-black leading-tight italic uppercase">Pro-Tip: Recovery Logic</p>
                 <p className="text-sm opacity-80 font-medium">Bunk limits are calculated based on your current semester progress.</p>
               </div>
             </div>
             <button className="relative z-10 px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-[0.1em] hover:scale-105 transition-all shadow-lg shadow-blue-700/20">
               Simulate Future Absences
             </button>
             {/* Decorative Background Element */}
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>

        </div>
      </main>
    </div>
  );
};

const SummaryCard = ({ title, value, status, color, icon: Icon }) => {
  const colorMap = {
    red: "text-red-600 bg-red-50 border-red-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
  };

  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex items-center justify-between group hover:border-blue-400 transition-all duration-300">
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-800 tracking-tighter">{value}</span>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border ${colorMap[color]}`}>
            {status}
          </span>
        </div>
      </div>
      <div className={`p-4 rounded-2xl ${colorMap[color]} group-hover:bg-blue-600 group-hover:text-white transition-all duration-300`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default SmartCompass;