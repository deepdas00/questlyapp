import React, { useState } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  BarChart3,
  Menu,
  X,
  PlusCircle,
  ArrowUpRight
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 scroll-smooth">
      {/* Navigation */}
   

   <Navbar/>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            All-in-One Academic Dashboard
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Master college life with <span className="text-blue-600">Intelligence.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Track attendance, manage assignments, and predict your GPA—driven by real-time data insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition shadow-lg">
              Start Your Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* 1. ACADEMIC PROGRESS TRACKER SECTION */}
      <section id="academics" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Academic Performance</h2>
            <p className="text-slate-500 font-medium">Monitor your GPA trends and semester-wise marks.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="overflow-x-auto text-left">
                <table className="w-full">
                  <thead>
                    <tr className="text-slate-400 text-sm border-b border-slate-100">
                      <th className="pb-4 font-medium">Semester</th>
                      <th className="pb-4 font-medium">Performance</th>
                      <th className="pb-4 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr className="border-b border-slate-50">
                      <td className="py-5 font-semibold">Semester 01</td>
                      <td className="py-5 font-bold text-blue-600 text-lg">8.4 CGPA</td>
                      <td className="py-5 text-right">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Completed</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="py-5 font-semibold">Semester 02</td>
                      <td className="py-5 font-bold text-blue-600 text-lg">8.7 CGPA</td>
                      <td className="py-5 text-right">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-5 font-semibold text-slate-400 italic">Semester 03 (Current)</td>
                      <td className="py-5 font-bold text-purple-600 text-lg">9.1 Predicted</td>
                      <td className="py-5 text-right">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase">In Progress</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-200">
                <ArrowUpRight className="mb-4" />
                <h4 className="text-xl font-bold mb-2">Smart Suggestion</h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Your "Theory of Computation" marks are trending higher. Keep this pace to break your 9.0 CGPA target.
                </p>
              </div>
              <div className="bg-slate-900 p-8 rounded-3xl text-white">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Target for Sem 4</p>
                <p className="text-4xl font-black">9.5 CGPA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ASSIGNMENT & REMINDER SECTION */}
      <section id="assignments" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Assignments & Tasks</h2>
              <p className="text-slate-500">Never miss a deadline again.</p>
            </div>
            <button className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
              Add New <PlusCircle size={20}/>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskCard 
              priority="High" 
              timeLeft="2 Days Left" 
              title="Physics Lab Journal" 
              desc="Complete the observations for the Pendulum experiment."
            />
            <TaskCard 
              priority="Medium" 
              timeLeft="5 Days Left" 
              title="DBMS SQL Assignment" 
              desc="Write queries for the library management system schema."
            />
            <div className="border-2 border-dashed border-slate-300 rounded-3xl flex items-center justify-center p-8 hover:bg-slate-100 cursor-pointer transition group">
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition">
                  <PlusCircle className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-bold">New Assignment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Existing Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Functionalities</h2>
            <p className="text-slate-500">Built for accuracy and speed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Calendar className="text-blue-500" />}
              title="Hybrid Attendance"
              desc="Day-wise or subject-wise tracking for ultimate flexibility."
            />
            <FeatureCard 
              icon={<TrendingUp className="text-purple-500" />}
              title="Safe Bunk Calc"
              desc="Calculates exactly how many classes you can afford to miss."
            />
            <FeatureCard 
              icon={<BookOpen className="text-emerald-500" />}
              title="Quick Notes"
              desc="Store important class links and lecture notes in one click."
            />
            <FeatureCard 
              icon={<AlertCircle className="text-rose-500" />}
              title="Smart Alerts"
              desc="Get notified when attendance drops below 75% automatically."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>© 2026 Smart Student Dashboard. Designed for the Future.</p>
      </footer>
    </div>
  );
};

// Sub-components for better organization
const TaskCard = ({ priority, timeLeft, title, desc }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition duration-300 group">
    <div className="flex justify-between items-start mb-6">
      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
        priority === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
      }`}>
        {priority} Priority
      </span>
      <span className="text-slate-400 text-xs flex items-center gap-1 font-medium italic">
        <Clock size={14}/> {timeLeft}
      </span>
    </div>
    <h4 className="text-lg font-bold text-slate-800 mb-2">{title}</h4>
    <p className="text-slate-500 text-sm mb-6 leading-relaxed">{desc}</p>
    <button className="w-full py-3 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-700 rounded-xl font-bold transition-all">
      Complete Task
    </button>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl hover:border-slate-100 transition-all border border-transparent">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;