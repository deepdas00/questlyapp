import React, { useState } from 'react';
import { 
  Search, BookOpen, FileText, Play, Download, 
  ExternalLink, Filter, FolderOpen, ChevronLeft
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const AcademicVault = () => {
  const [selectedSubject, setSelectedSubject] = useState('Data Structures & Algo');

  const subjects = [
    'Data Structures & Algo', 'Database Management', 'Operating Systems', 
    'Computer Networks', 'Discrete Mathematics', 'Software Engineering'
  ];

  const resources = [
    { id: 1, title: 'Unit 1: Linked Lists & Stacks', type: 'Notes', format: 'PDF', size: '2.4 MB', date: '2 days ago' },
    { id: 2, title: 'Unit 2: Trees and Graphs', type: 'Notes', format: 'PDF', size: '5.1 MB', date: '5 days ago' },
    { id: 3, title: 'Mid-Sem Question Paper 2025', type: 'Paper', format: 'PDF', size: '1.2 MB', date: '1 month ago' },
    { id: 4, title: 'End-Sem Pattern Analysis', type: 'Paper', format: 'DOCX', size: '800 KB', date: '2 weeks ago' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* 1. PERMANENT SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 h-screen overflow-y-auto p-6 lg:p-10">
        
        {/* Top Navigation & Search Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
              <BookOpen size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">Academic Vault</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">GenDelta Central Repository</p>
            </div>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search notes, papers, or units..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
              />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-blue-600 shadow-sm transition-all">
              <Filter size={20} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: SUBJECT NAVIGATION & STORAGE */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
              <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Course Modules</h3>
              <div className="space-y-2">
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-between group ${
                      selectedSubject === sub 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                      : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{sub}</span>
                    <ChevronLeft size={16} className={`transition-transform ${selectedSubject === sub ? 'rotate-180 text-blue-400' : 'opacity-0'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Premium Storage Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-100">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Vault Capacity</p>
              <h4 className="text-2xl font-black mb-6">1.2 GB <span className="text-sm font-medium opacity-60">/ 2.0 GB</span></h4>
              <div className="w-full bg-white/20 h-2 rounded-full mb-4">
                <div className="bg-white h-full w-[65%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              </div>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                Upgrade Storage
              </button>
            </div>
          </div>

          {/* RIGHT: CONTENT AREA */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* YouTube Featured Section */}
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group border border-slate-800">
              <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-8">
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full border border-red-500/20 text-[9px] font-black uppercase tracking-widest">
                    <Play size={12} fill="currentColor" /> Active Playlist
                  </div>
                  <h2 className="text-3xl font-black leading-none">{selectedSubject} Essentials</h2>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-sm">Hand-picked video lectures and crash courses to clear your concepts before the finals.</p>
                  <button className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest hover:text-blue-400 transition-colors">
                    Watch Now <ExternalLink size={14} />
                  </button>
                </div>
                <div className="w-full xl:w-64 aspect-video bg-slate-800 rounded-[2rem] border border-slate-700 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                   <Play size={40} className="text-white relative z-10 opacity-50 group-hover:opacity-100 transition-opacity" fill="white" />
                </div>
              </div>
            </div>

            {/* Document Grid */}
            <div>
              <div className="flex justify-between items-end mb-6 px-2">
                <div>
                  <h3 className="font-black text-2xl text-slate-800 tracking-tight tracking-tighter">Resources</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Found {resources.length} files in this module</p>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  + Add File
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((file) => (
                  <div key={file.id} className="bg-white border border-slate-200 p-6 rounded-[2rem] hover:border-blue-500 hover:shadow-xl hover:shadow-slate-100 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{file.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{file.format}</span>
                          <span className="text-[9px] text-slate-300 font-bold">•</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{file.size}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <Download size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Archives Section */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                   <FolderOpen size={20} />
                </div>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Exam Archives</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['2024 End-Sem', '2023 Suppli', 'Internal Assessment'].map((folder) => (
                  <div key={folder} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-orange-200 group cursor-pointer transition-all">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mb-3 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <ExternalLink size={14} />
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{folder}</span>
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

export default AcademicVault;