import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MoreHorizontal, 
  Clock, CheckSquare, MessageSquare, Paperclip,
  Layout, List, LayoutPanelLeft, Flag, Zap, ArrowRight, X, Trash2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const ProjectCamp = () => {
  const [showModal, setShowModal] = useState(false);
  
  // State for Task Management
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Fix Grandmaster Hub 3D Lag', project: 'Grandmaster Hub', priority: 'High', status: 'In Progress', comments: 12 },
    { id: 2, title: 'GenDelta Hackathon Poster', project: 'GenDelta', priority: 'Medium', status: 'Todo', comments: 3 },
    { id: 3, title: 'Implement SmartCompass v2 Logic', project: 'SmartCompass', priority: 'High', status: 'In Progress', comments: 8 },
    { id: 5, title: 'Firebase Auth Fix', project: 'Project Camp', priority: 'Medium', status: 'Done', comments: 5 },
  ]);

  // Form State
  const [newTask, setNewTask] = useState({ title: '', project: 'GenDelta', priority: 'Medium' });

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    const task = {
      ...newTask,
      id: Date.now(),
      status: 'Todo',
      comments: 0
    };
    setTasks([...tasks, task]);
    setShowModal(false);
    setNewTask({ title: '', project: 'GenDelta', priority: 'Medium' });
  };

  const updateStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (p) => {
    if (p === 'High') return 'text-red-600 bg-red-50 border-red-100';
    if (p === 'Medium') return 'text-orange-600 bg-orange-50 border-orange-100';
    return 'text-blue-600 bg-blue-50 border-blue-100';
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* 1. SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 h-screen overflow-y-auto p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                <Layout size={14} /> Production Environment
              </div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Project Camp</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Operational Task Management</p>
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus size={18} /> CREATE MISSION
            </button>
          </header>

          {/* Kanban Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Column 
              title="Backlog" 
              color="slate-400"
              tasks={tasks.filter(t => t.status === 'Todo')}
              updateStatus={updateStatus}
              deleteTask={deleteTask}
              colorFn={getPriorityColor}
              nextStatus="In Progress"
            />
            <Column 
              title="Execution" 
              color="blue-600"
              tasks={tasks.filter(t => t.status === 'In Progress')}
              updateStatus={updateStatus}
              deleteTask={deleteTask}
              colorFn={getPriorityColor}
              nextStatus="Done"
              prevStatus="Todo"
            />
            <Column 
              title="Deployed" 
              color="emerald-600"
              tasks={tasks.filter(t => t.status === 'Done')}
              updateStatus={updateStatus}
              deleteTask={deleteTask}
              colorFn={getPriorityColor}
              prevStatus="In Progress"
            />
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800">New Mission</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={20}/></button>
            </div>
            <form onSubmit={addTask} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Task Title</label>
                <input 
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:outline-none focus:border-blue-500 font-bold text-slate-800 shadow-inner"
                  placeholder="Task objective..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Project</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-black text-[10px] uppercase outline-none cursor-pointer"
                    onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                  >
                    <option>GenDelta</option>
                    <option>Grandmaster Hub</option>
                    <option>SmartCompass</option>
                    <option>Project Camp</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Priority</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-black text-[10px] uppercase outline-none cursor-pointer"
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 mt-4">
                INITIATE TASK
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Column = ({ title, color, tasks, updateStatus, deleteTask, colorFn, nextStatus, prevStatus }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center px-4 bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-slate-100">
      <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-800 flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full bg-${color}`}></div> {title} 
        <span className="text-slate-300 font-bold ml-1">{tasks.length}</span>
      </h3>
      <MoreHorizontal size={14} className="text-slate-300" />
    </div>
    <div className="min-h-[600px] space-y-4">
      {tasks.map(task => (
        <div key={task.id} className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm hover:border-blue-400 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[8px] font-black px-2.5 py-1 rounded-lg uppercase border ${colorFn(task.priority)}`}>
              {task.priority}
            </span>
            <button onClick={() => deleteTask(task.id)} className="text-slate-200 hover:text-red-500 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1 leading-tight group-hover:text-blue-600 transition-colors">{task.title}</h4>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-6">{task.project}</p>
          
          <div className="flex gap-2 pt-5 border-t border-slate-50">
            {prevStatus && (
              <button 
                onClick={() => updateStatus(task.id, prevStatus)}
                className="flex-1 text-[9px] font-black py-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all uppercase tracking-tighter"
              >
                Revert
              </button>
            )}
            {nextStatus && (
              <button 
                onClick={() => updateStatus(task.id, nextStatus)}
                className={`flex-[2] text-[9px] font-black py-3 rounded-xl transition-all uppercase flex items-center justify-center gap-2 tracking-widest ${
                  nextStatus === 'Done' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {nextStatus === 'Done' ? 'Complete' : 'Start'} <ArrowRight size={12}/>
              </button>
            )}
          </div>
          
          {/* Subtle Decorative Gradient */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-slate-50 to-transparent -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      ))}
      
      {/* Ghost Card for "Add" visual */}
      <button 
        onClick={() => {}} 
        className="w-full py-8 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300 hover:text-slate-400 hover:border-slate-200 transition-all"
      >
        <Plus size={24} className="mb-1" />
        <span className="text-[10px] font-black uppercase tracking-widest">Add Insight</span>
      </button>
    </div>
  </div>
);

export default ProjectCamp;