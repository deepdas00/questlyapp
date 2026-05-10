import React from "react";
import { useState, useEffect } from "react";
import {
  Trophy,
  Target,
  Zap,
  Clock,
  BookOpen,
  Download,
  Play,
  TrendingUp,
  MoreVertical,
  LayoutGrid,
  FileText,
  BarChart3,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../utils/api"

const QuestlyAcademicWhite = () => {

  const [vaultItems, setVaultItems] = useState([]);
const [selectedSubject, setSelectedSubject] = useState("DBMS");
const [loading, setLoading] = useState(false);



  const [dirHandle, setDirHandle] = useState(null);


const pickFolder = async () => {
  if (!window.showDirectoryPicker) {
    alert("Your browser does not support folder access. Use Chrome.");
    return;
  }

  try {
    const handle = await window.showDirectoryPicker();
    setDirHandle(handle);
    console.log("Folder selected:", handle.name);
  } catch (err) {
    console.log("User cancelled");
  }
};



const uploadFile = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", selectedSubject);

    const res = await API.post("/api/drive/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert(res.data.msg);

    fetchFiles(); // 🔥 refresh list
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  } finally {
    setLoading(false);
  }
};

const fetchFiles = async () => {
  try {
    const res = await API.get("/api/drive/files");
    setVaultItems(res.data.files);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchFiles();
}, []);








  const subjects = [
    { name: "Data Structures", attendance: 92, grade: "A", status: "On Track", color: "bg-blue-500" },
    { name: "Database Systems", attendance: 74, grade: "B+", status: "Low Attendance", color: "bg-orange-500" },
    { name: "Operating Systems", attendance: 85, grade: "A-", status: "On Track", color: "bg-indigo-500" },
    { name: "Network Security", attendance: 60, grade: "C", status: "Critical", color: "bg-red-500" },
  ];

  const deadlines = [
    { title: "Compiler Design Lab", sub: "CS-402", due: "Tomorrow", urgency: "High" },
    { title: "Research Paper Draft", sub: "ENG-101", due: "In 3 days", urgency: "Mid" },
  ];



  const connectDrive = () => {
  window.open(
    `${import.meta.env.VITE_API_URL}/api/drive/connect`,
    "_self"
  );
};



  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <main className="flex-1 p-4 lg:p-10 max-w-[1600px] mx-auto">
          {/* --- HEADER --- */}
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Academic Command Center</h1>
            <p className="text-slate-500 text-sm font-medium">All-in-one Semester VI Tracking</p>
          </div>

          {/* --- STATS GRID (Always Visible) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard label="Current CGPA" value="8.92" icon={<Trophy className="text-yellow-500" />} trend="+0.12" />
            <StatCard label="Attendance Avg" value="78%" icon={<Zap className="text-blue-500" />} trend="-2%" alert />
            <StatCard label="Credits Earned" value="124" icon={<BookOpen className="text-indigo-500" />} />
            <StatCard label="Target GPA" value="9.50" icon={<Target className="text-emerald-500" />} isTarget />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* --- LEFT COLUMN: OVERVIEW & ANALYTICS --- */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* SUBJECT MATRIX (Overview) */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black uppercase tracking-tight">Subject Matrix</h3>
                  <BarChart3 className="text-slate-400" size={20} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                        <th className="pb-4">Subject</th>
                        <th className="pb-4 text-center">Attendance</th>
                        <th className="pb-4 text-center">Grade</th>
                        <th className="pb-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {subjects.map((sub, i) => (
                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-8 rounded-full ${sub.color}`}></div>
                              <span className="font-bold text-sm text-slate-700">{sub.name}</span>
                            </div>
                          </td>
                          <td className="py-5">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-sm font-black">{sub.attendance}%</span>
                              <div className="w-20 bg-slate-100 h-1 rounded-full overflow-hidden">
                                <div className={`${sub.color} h-full`} style={{ width: `${sub.attendance}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 text-center font-black text-slate-900">{sub.grade}</td>
                          <td className="py-5 text-right">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              sub.status === "Critical" ? "bg-red-50 text-red-600" : 
                              sub.status === "On Track" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* QUICK ANALYTICS & VAULT ROW */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">

  <div className="flex justify-between items-center mb-6">
    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
      <Download size={14} /> Academic Vault
    </h3>

    <button
  onClick={connectDrive}
  className="text-xs bg-blue-600 text-white px-4 py-2 rounded-xl"
>
  Connect Drive
</button>
  </div>


  <select
  value={selectedSubject}
  onChange={(e) => setSelectedSubject(e.target.value)}
  className="mb-3 text-xs border p-2 rounded"
>
  <option value="DBMS">DBMS</option>
  <option value="OS">OS</option>
  <option value="DSA">DSA</option>
</select>

  {/* Upload */}
  <input
    type="file"
    onChange={uploadFile}
    className="mb-4 text-xs"
  />

  {/* Files */}
<div className="space-y-4">
  {vaultItems.length === 0 ? (
    <p className="text-xs text-slate-400">
      No files found
    </p>
  ) : (
    vaultItems.map((item, i) => (
      <div
        key={i}
        className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl border"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FileText size={16} />
          </div>

          <div>
            <p className="text-xs font-bold">
              {item.name}
            </p>

            <p className="text-[10px] text-slate-400">
              {item.mimeType}
            </p>
          </div>
        </div>

        <a
          href={item.webViewLink}
          target="_blank"
          className="text-blue-500 text-xs font-bold"
        >
          Open
        </a>
      </div>
    ))
  )}
</div>
</div>
            </div>

            {/* --- RIGHT COLUMN: PREDICTOR & DEADLINES --- */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* GPA PREDICTOR (Analytics) */}
              <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-[2.5rem] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><TrendingUp size={18} /></div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-900">GPA Predictor</h3>
                </div>
                <p className="text-xs text-indigo-800/60 font-medium mb-6">
                  To reach your <span className="font-bold">9.50 GPA</span> goal, you need <span className="text-indigo-600 font-black">9.2</span> in remaining internals.
                </p>
                <div className="space-y-4">
                  <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 w-[88%]"></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-indigo-400">
                    <span>Current: 8.92</span>
                    <span>Goal: 9.50</span>
                  </div>
                </div>
              </div>

              {/* DEADLINES */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                  <Clock size={14} /> Upcoming Deadlines
                </h3>
                <div className="space-y-6">
                  {deadlines.map((d, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className={`mt-1.5 w-2 h-2 rounded-full ${d.urgency === "High" ? "bg-red-500" : "bg-blue-500"}`}></div>
                        <div>
                          <p className="text-sm font-black text-slate-800 leading-none">{d.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{d.sub}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-900 whitespace-nowrap">{d.due}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                  Sync Calendar
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, trend, alert, isTarget }) => (
  <div className={`bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm ${isTarget ? "bg-emerald-50/30 border-emerald-100" : ""}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-slate-50 rounded-xl">{icon}</div>
      {trend && (
        <span className={`text-[10px] font-black ${trend.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
    <div className="flex items-end gap-2">
      <h3 className="text-2xl font-black text-slate-900">{value}</h3>
      {alert && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mb-2"></div>}
    </div>
  </div>
);

export default QuestlyAcademicWhite;