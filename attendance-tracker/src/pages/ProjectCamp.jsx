import React, { useState } from "react";
import {
  Users,
  Mail,
  Send,
  Trash2,
  Layout,
  Plus,
  MoreVertical,
  Shield,
  UserPlus,
  CheckCircle2,
  Clock,
  ChevronRight,
  Trophy,
  Target,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const IntegratedProjectHub = () => {
  // Static State to simulate multiple separate groups/works
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "AI Research Thesis",
      category: "Computer Science",
      progress: 65,
      color: "border-t-indigo-500",
      bg: "bg-indigo-50/30",
      members: [
        { email: "lead.designer@uni.edu", status: "JOINED", role: "ADMIN" },
        { email: "researcher.1@uni.edu", status: "JOINED", role: "MEMBER" },
        { email: "expert.ref@uni.edu", status: "PENDING", role: "MEMBER" },
      ],
      tasks: [
        {
          id: 101,
          text: "Define Neural Architecture",
          status: "DONE",
          assignee: "You",
        },
        {
          id: 102,
          text: "Data Normalization Script",
          status: "PENDING",
          assignee: "Researcher 1",
        },
      ],
    },
    {
      id: 2,
      title: "Business Marketing Plan",
      category: "Economics",
      progress: 30,
      color: "border-t-emerald-500",
      bg: "bg-emerald-50/30",
      members: [
        { email: "strategist@uni.edu", status: "JOINED", role: "ADMIN" },
        { email: "analyst@uni.edu", status: "JOINED", role: "MEMBER" },
      ],
      tasks: [
        {
          id: 201,
          text: "Market SWOT Analysis",
          status: "PENDING",
          assignee: "Analyst",
        },
        {
          id: 202,
          text: "Financial Projections",
          status: "DONE",
          assignee: "You",
        },
      ],
    },
  ]);

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

        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans w-full selection:bg-indigo-100">
          {/* HEADER SECTION */}
          <div className="max-w-7xl mx-auto mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-4">
                  <Layers size={14} className="text-slate-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    Collaborative Workspace
                  </span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  Group <span className="text-indigo-600">Quests</span>
                </h1>
                <p className="text-slate-500 mt-2 font-medium">
                  Manage separated work for different teams in one place.
                </p>
              </div>

              <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all hover:shadow-xl hover:shadow-indigo-200 group">
                <Plus
                  size={20}
                  className="group-hover:rotate-90 transition-transform"
                />
                Create New Group Work
              </button>
            </div>
          </div>

          {/* PROJECT GRID */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`relative overflow-hidden bg-white border border-slate-200 border-t-4 ${project.color} rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500`}
              >
                <div className="p-6 md:p-10">
                  {/* TOP ROW: PROJECT INFO */}
                  <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg uppercase">
                          {project.category}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          ID: #{project.id}0023
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-slate-800 mb-2">
                        {project.title}
                      </h2>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Users size={16} />
                          <span className="text-sm font-bold">
                            {project.members.length} Members
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Target size={16} />
                          <span className="text-sm font-bold">
                            {project.tasks.length} Active Tasks
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PROGRESS WHEEL STYLE */}
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase">
                          Total Progress
                        </p>
                        <p className="text-xl font-black text-slate-800">
                          {project.progress}%
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 rotate-45" />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-8">
                    {/* COLUMN 1: TEAM & INVITATION (Separated Work Logic) */}
                    <div className="col-span-12 lg:col-span-5 bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-slate-700 flex items-center gap-2">
                          <UserPlus size={18} className="text-indigo-500" />{" "}
                          Team Access
                        </h3>
                      </div>

                      {/* Invite Input */}
                      <div className="relative mb-6">
                        <input
                          type="email"
                          placeholder="Enter teammate email..."
                          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                        <button className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 text-white rounded-xl shadow-md">
                          <Send size={16} />
                        </button>
                      </div>

                      {/* Member Rows */}
                      <div className="space-y-3">
                        {project.members.map((member, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 group"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${member.status === "PENDING" ? "bg-slate-300" : "bg-slate-800"}`}
                              >
                                {member.email[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="text-xs font-black text-slate-700 truncate w-32 md:w-48">
                                  {member.email}
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">
                                  {member.role}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-[8px] font-black px-2 py-1 rounded-lg ${member.status === "JOINED" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                            >
                              {member.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* COLUMN 2: SHARED TASKS (Separated Deliverables) */}
                    <div className="col-span-12 lg:col-span-7">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black text-slate-700 flex items-center gap-2">
                          <CheckCircle2
                            size={18}
                            className="text-emerald-500"
                          />{" "}
                          Work Modules
                        </h3>
                        <button className="text-[10px] font-black text-indigo-600 hover:underline">
                          View All Tasks
                        </button>
                      </div>

                      <div className="space-y-3">
                        {project.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`h-5 w-5 rounded-md border-2 flex items-center justify-center ${task.status === "DONE" ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200"}`}
                              >
                                {task.status === "DONE" && (
                                  <CheckCircle2 size={12} />
                                )}
                              </div>
                              <div>
                                <p
                                  className={`text-sm font-bold ${task.status === "DONE" ? "text-slate-400 line-through" : "text-slate-700"}`}
                                >
                                  {task.text}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium">
                                  Assigned to:{" "}
                                  <span className="text-indigo-500">
                                    {task.assignee}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <ArrowUpRight
                              size={16}
                              className="text-slate-300 group-hover:text-indigo-500 transition-colors"
                            />
                          </div>
                        ))}

                        {/* Add Task Quick Action */}
                        <button className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs font-bold hover:border-indigo-200 hover:text-indigo-400 transition-all flex items-center justify-center gap-2">
                          <Plus size={14} /> Add Task to this Group
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM DECORATIVE ELEMENT */}
                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Last updated: 2 hours ago
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedProjectHub;
