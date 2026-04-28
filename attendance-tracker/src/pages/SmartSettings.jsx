import React, { useState, useEffect, useContext } from "react";
import {
  User,
  Shield,
  Target,
  Calendar,
  Book,
  Lock,
  Camera,
  Trash2,
  Plus,
  Save,
  RefreshCw,
  ChevronRight,
  LayoutGrid,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const SmartSettings = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [loading, setLoading] = useState(false);
  const [routine, setRoutine] = useState([]);

  const { user } = useContext(AuthContext);
  // --- Profile State ---
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    college: "",
    branch: "",
    enrollment: "",
    semester: "",
    portfolio: "",
  });

  //current user data fetech
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.name || "",
        email: user.email || "",
        college: user.college || "",
        branch: user.branch || "",
        enrollment: user.enrollment || "",
        portfolio: user.portfolio || "",
      });
    }
  }, [user]);

  //routine fetch
  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await API.get("/routine");
        setRoutine(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoutine();
  }, []);

  //fetch semester details
  const [semester, setSemester] = useState(null);

  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const res = await API.get("/semester/active");
        setSemester(res.data);

        setAcademicData({
          targetAttendance: res.data.target_percentage ?? 75,
          label: res.data.label || "",
          semesterStart: res.data.start_date?.slice(0, 10) || "",
          semesterEnd: res.data.end_date?.slice(0, 10) || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchSemester();
  }, []);

  // --- Academic State ---
  const [academicData, setAcademicData] = useState({
    targetAttendance: 75,
    label: "",
    semesterStart: "",
    semesterEnd: "",
  });

  // --- Subjects State ---
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    faculty: "",
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    code: "",
    faculty: "",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const startEdit = (sub) => {
    setEditId(sub._id);
    setEditData({
      name: sub.name,
      code: sub.code,
      faculty: sub.faculty,
    });
  };

  const handleUpdateSubject = async () => {
    try {
      const res = await API.put(`/subject/${editId}`, editData);

      setSubjects((prev) => prev.map((s) => (s._id === editId ? res.data : s)));

      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await API.get("/subject");
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.name.trim()) return;

    try {
      const res = await API.post("/subject/add", {
        name: newSubject.name,
        code: newSubject.code,
        faculty: newSubject.faculty,
      });

      setSubjects((prev) => [...prev, res.data]);

      setNewSubject({
        name: "",
        code: "",
        faculty: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await API.delete(`/subject/${id}`);
      setSubjects((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const [newClass, setNewClass] = useState({
    subject_id: "",
    day: "MON",
    start_time: "",
    end_time: "",
    faculty: "",
  });

  const addClassToRoutine = async () => {
    // 🔒 SUBJECT MUST
    if (!newClass.subject_id) {
      toast.error("Please select a subject ❌");
      return;
    }

    const { start_time, end_time } = newClass;

    // 🔒 If both times exist → validate order
    if (start_time && end_time) {
      if (start_time >= end_time) {
        toast.error("End time must be after start time ❌");
        return;
      }
    }

    // 🔒 If only one time is given → allow but warn (optional UX)

    if (!start_time && end_time) {
      toast("Start time not provided (optional)", { icon: "ℹ️" });
    }

    const toastId = toast.loading("Adding class...");

    try {
      const res = await API.post("/routine/add", {
        subject_id: newClass.subject_id,
        day_of_week: newClass.day,
        start_time: start_time || null,
        end_time: end_time || null,
        faculty: newClass.faculty,
      });

      const subject = subjects.find((s) => s._id === newClass.subject_id);

      const newItem = {
        ...res.data,
        subject_id: subject, // attach full object
      };

      setRoutine((prev) => [...prev, newItem]);
      // 🔄 RESET
      setNewClass({
        subject_id: "",
        day: "MON",
        start_time: "",
        end_time: "",
        faculty: "",
      });

      toast.success("Class added successfully ✅", { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add ❌", {
        id: toastId,
      });
    }
  };
  const deleteRoutine = async (id) => {
    const toastId = toast.loading("Deleting...");

    try {
      await API.delete(`/routine/${id}`);

      setRoutine((prev) => prev.filter((r) => r._id !== id));

      toast.success("Deleted successfully 🗑️", { id: toastId });
    } catch {
      toast.error("Delete failed ❌", { id: toastId });
    }
  };

  const handleProfileSave = async () => {
    setLoading(true);
    const toastId = toast.loading("Saving profile...");

    try {
      const res = await API.put("/user/update", {
        name: profileData.fullName,
        email: profileData.email,
        college: profileData.college,
        branch: profileData.branch,
        enrollment: profileData.enrollment,
        portfolio: profileData.portfolio,
      });

      setProfileData({
        fullName: res.data.name,
        email: res.data.email,
        college: res.data.college,
        branch: res.data.branch,
        enrollment: res.data.enrollment,
        portfolio: res.data.portfolio,
      });

      toast.success("Profile updated ✅", { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed ❌", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcademicSave = async () => {
    setLoading(true);
    const toastId = toast.loading("Saving academic settings...");

    try {
      await API.put("/semester/update", {
        target_percentage: academicData.targetAttendance,
        label: academicData.label,
        start_date: academicData.semesterStart,
        end_date: academicData.semesterEnd,
      });

      toast.success("Academic settings updated 🎯", { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed ❌", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen  text-slate-200 font-sans">
      <Sidebar />

      <main className="flex-1 h-screen overflow-y-auto p-6 lg:p-10 custom-scrollbar">
        <div className=" mx-auto">
          {/* Breadcrumb & Title */}
          <header className="mb-10">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
              CAMPUS OS / CONTROL PANEL
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              Settings
            </h1>
            <p className="text-slate-500 text-sm italic">
              Manage your profile, attendance thresholds, and weekly schedule
            </p>
          </header>

          {/* Tab Navigation */}
          <nav className="flex gap-2 p-1.5 bg-blue-100 rounded-2xl mb-10 w-fit border border-slate-800/50">
            {["Profile", "Academic", "Routine", "Subjects", "Security"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab
                      ? "bg-[#23252e] text-blue-400 shadow-lg shadow-black/50 ring-1 ring-white/5"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </nav>

          {/* Content Area */}
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* --- PROFILE TAB --- */}
            {activeTab === "Profile" && (
              <div className="space-y-6">
                {/* Profile Snapshot Card */}
                <div className="bg-blue-100 border border-slate-800/50 rounded-[2rem] p-8 flex items-center gap-8 relative overflow-hidden text-slate-500">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.8rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                      D
                    </div>
                    <button className="absolute -bottom-1 -right-1 p-2 bg-[#1c1e26] border border-slate-700 text-white rounded-full shadow-xl">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-500 tracking-tighter italic uppercase">
                      {profileData.fullName}
                    </h2>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">
                      {profileData.email}
                    </p>
                    <div className="flex gap-6 mt-4 ">
                      <StatMini label="4th" sub="Semester" />
                      <StatMini label="82%" sub="Attendance" />
                      <StatMini label="7" sub="Subjects" />
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <ActionCard title="Personal Info" icon={User}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 ">
                    <ControlInput
                      label="Full Name"
                      value={profileData.fullName}
                      onChange={(v) =>
                        setProfileData({ ...profileData, fullName: v })
                      }
                    />
                    <ControlInput
                      label="Email"
                      value={profileData.email}
                      onChange={(v) =>
                        setProfileData({ ...profileData, email: v })
                      }
                    />
                    <ControlInput
                      label="University / College"
                      value={profileData.college}
                      onChange={(v) =>
                        setProfileData({ ...profileData, college: v })
                      }
                    />
                    <ControlInput
                      label="Branch / Dept"
                      value={profileData.branch}
                      onChange={(v) =>
                        setProfileData({ ...profileData, branch: v })
                      }
                    />
                    <ControlInput
                      label="Enrollment No."
                      value={profileData.enrollment}
                      onChange={(v) =>
                        setProfileData({ ...profileData, enrollment: v })
                      }
                    />
                    <ControlInput
                      label="Active Semester"
                      value={academicData.label}
                      readOnly
                      className="cursor-not-allowed"
                    />

                    <div className="md:col-span-2">
                      <ControlInput
                        label="Portfolio / Website"
                        value={profileData.portfolio}
                        onChange={(v) =>
                          setProfileData({ ...profileData, portfolio: v })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-800/50">
                    <button className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-800 transition-all">
                      Discard
                    </button>
                    <button
                      onClick={handleProfileSave}
                      disabled={loading}
                      className="px-6 py-2.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </ActionCard>
              </div>
            )}

            {/* --- ACADEMIC TAB --- */}
            {activeTab === "Academic" && (
              <div className="space-y-8">
                {/* 🔥 1. TARGET SECTION */}
                <div className="bg-blue-100 border border-slate-800/50 rounded-[2rem] p-10 flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="text-center md:text-left">
                    <h3 className="text-7xl font-black text-blue-500 italic">
                      {academicData.targetAttendance}%
                    </h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">
                      Target Attendance
                    </p>
                  </div>

                  <div className="flex-1 max-w-md w-full">
                    <p className="text-right text-[11px] text-slate-500 mb-6 italic">
                      Set your minimum attendance threshold
                    </p>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={academicData.targetAttendance}
                      onChange={(e) =>
                        setAcademicData({
                          ...academicData,
                          targetAttendance: Number(e.target.value),
                        })
                      }
                      className="w-full h-1.5 bg-blue-900 rounded-full accent-blue-500"
                    />

                    <div className="flex justify-between mt-6">
                      {[0, 50, 60, 75, 85, 100].map((val) => (
                        <button
                          key={val}
                          onClick={() =>
                            setAcademicData({
                              ...academicData,
                              targetAttendance: val,
                            })
                          }
                          className={`w-12 py-2 rounded-lg text-[10px] font-black ${
                            academicData.targetAttendance === val
                              ? "bg-blue-600 text-white"
                              : "bg-blue-900 text-blue-200"
                          }`}
                        >
                          {val}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 🔥 2. SEMESTER DETAILS */}
                <ActionCard
                  title="Semester Details"
                  icon={Calendar}
                  badge="Active"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Semester Name */}
                    <ControlInput
                      label="Semester Name"
                      value={academicData.label}
                      onChange={(val) =>
                        setAcademicData({ ...academicData, label: val })
                      }
                    />

                    {/* Academic Year */}

                    {/* Start Date */}
                    <ControlInput
                      type="date"
                      label="Semester Start"
                      value={academicData.semesterStart}
                      onChange={(val) =>
                        setAcademicData({ ...academicData, semesterStart: val })
                      }
                    />

                    {/* End Date */}
                    <ControlInput
                      type="date"
                      label="Semester End"
                      value={academicData.semesterEnd}
                      onChange={(val) =>
                        setAcademicData({ ...academicData, semesterEnd: val })
                      }
                    />

                    {/* Exam Start */}
                  </div>
                </ActionCard>

                {/* 🔥 3. ACTIONS */}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={async () => {
                      const toastId = toast.loading("Archiving semester...");

                      try {
                        await API.post("/semester/end");

                        toast.success("Semester archived ✅", { id: toastId });

                        window.location.reload();
                      } catch {
                        toast.error("Failed ❌", { id: toastId });
                      }
                    }}
                    className="px-6 py-3 rounded-xl bg-red-500/5 text-red-500 border border-red-500/10 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    Archive Semester
                  </button>

                  <button
                    onClick={handleAcademicSave}
                    className="px-8 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}

            {/* --- ROUTINE TAB --- */}
            {/* --- ROUTINE TAB --- */}
            {activeTab === "Routine" && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <ActionCard
                  title="Weekly Routine"
                  icon={Calendar}
                  badge="Semester-wide"
                >
                  <p className="text-[10px] text-slate-500 mb-8 italic">
                    Manage your weekly class schedule with time-based slots.
                  </p>

                  {/* 🔥 WEEK GRID */}
                  <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-10">
                    {/* Header Section */}
                    <div className="bg-slate-50 border-b border-slate-200 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-black text-slate-800 tracking-tight">
                            Academic Routine
                          </h3>
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                            {academicData.label} •{" "}
                            {new Date().toLocaleString("default", {
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="px-4 py-2 bg-blue-100 rounded-full">
                          <span className="text-[10px] font-black text-blue-600 uppercase">
                            Live Schedule
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Main Grid - 7 Columns for Full Week */}
                    <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                      {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                        (day, idx) => {
                          // Define unique colors for each day for that "colorful" look
                          const colors = [
                            "bg-blue-50 text-blue-600 border-blue-200",
                            "bg-purple-50 text-purple-600 border-purple-200",
                            "bg-pink-50 text-pink-600 border-pink-200",
                            "bg-orange-50 text-orange-600 border-orange-200",
                            "bg-emerald-50 text-emerald-600 border-emerald-200",
                            "bg-rose-50 text-rose-600 border-rose-200",
                            "bg-amber-50 text-amber-600 border-amber-200",
                          ];

                          const dayClasses = routine
                            .filter((r) => r.day_of_week === day)
                            .sort((a, b) =>
                              (a.start_time || "").localeCompare(
                                b.start_time || "",
                              ),
                            );

                          return (
                            <div key={day} className="flex flex-col min-h-full">
                              {/* DAY HEADER */}
                              <div
                                className={`p-4 text-center border-b ${colors[idx]} border-opacity-50`}
                              >
                                <span className="text-[12px] font-black tracking-[0.2em]">
                                  {day}
                                </span>
                              </div>

                              {/* CLASSES LIST */}
                              <div className="p-3 space-y-3 bg-white flex-grow">
                                {dayClasses.map((item) => (
                                  <div
                                    key={item._id}
                                    className="group relative bg-slate-50 border border-slate-200 p-2 rounded-2xl hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                                  >
                                    {/* Subject Name */}
                                    <p className="text-[0.7rem] font-black text-slate-800 uppercase leading-tight mb-2 break-words whitespace-normal">
                                      {item.subject_id?.name || "Subject"}
                                    </p>

                                    {/* Time Badge */}
                                    {item.start_time && (
                                      <div className="inline-flex items-center px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-sm mb-2">
                                        <span className="text-[0.6rem] font-bold text-slate-600 tabular-nums">
                                          {item.start_time} - {item.end_time}
                                        </span>
                                      </div>
                                    )}

                                    {/* Faculty Info */}
                                    {item.faculty && (
                                      <p className="text-[0.6rem] font-bold text-blue-500 uppercase tracking-wider pl-1 pr-1">
                                        {item.faculty}
                                      </p>
                                    )}

                                    {/* Delete Button */}
                                    <button
                                      onClick={() => deleteRoutine(item._id)}
                                      className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                ))}

                                {/* Empty State */}
                                {dayClasses.length === 0 && (
                                  <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
                                    <span className="text-[10px] font-black text-slate-400 uppercase italic">
                                      Free
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                  {/* 🔥 ADD CLASS */}
                  <div className="bg-white border border-slate-800/50 p-6 rounded-[1.8rem]">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">
                      Add Class to Routine
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* SUBJECT */}
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block">
                          Subject
                        </label>
                        <select
                          value={newClass.subject_id}
                          onChange={(e) =>
                            setNewClass({
                              ...newClass,
                              subject_id: e.target.value,
                            })
                          }
                          className="w-full bg-blue-900 border border-slate-800/50 p-3 rounded-xl text-xs"
                        >
                          <option value="">Select Subject</option>
                          {subjects.map((sub) => (
                            <option key={sub._id} value={sub._id}>
                              {sub.name} ({sub.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* DAY */}
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block">
                          Day
                        </label>
                        <select
                          value={newClass.day}
                          onChange={(e) =>
                            setNewClass({ ...newClass, day: e.target.value })
                          }
                          className="w-full bg-blue-900 border border-slate-800/50 p-3 rounded-xl text-xs"
                        >
                          <option value="MON">Monday</option>
                          <option value="TUE">Tuesday</option>
                          <option value="WED">Wednesday</option>
                          <option value="THU">Thursday</option>
                          <option value="FRI">Friday</option>
                          <option value="SAT">Saturday</option>
                          <option value="SUN">Sunday</option>
                        </select>
                      </div>

                      {/* START TIME */}
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={newClass.start_time}
                          onChange={(e) =>
                            setNewClass({
                              ...newClass,
                              start_time: e.target.value,
                            })
                          }
                          className="w-full bg-blue-900 border border-slate-800/50 p-3 rounded-xl text-xs"
                        />
                      </div>

                      {/* END TIME */}
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={newClass.end_time}
                          onChange={(e) =>
                            setNewClass({
                              ...newClass,
                              end_time: e.target.value,
                            })
                          }
                          className="w-full bg-blue-900 border border-slate-800/50 p-3 rounded-xl text-xs"
                        />
                      </div>

                      {/* FACULTY */}
                      <div className="md:col-span-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block">
                          Faculty (Optional)
                        </label>
                        <input
                          value={newClass.faculty}
                          onChange={(e) =>
                            setNewClass({
                              ...newClass,
                              faculty: e.target.value,
                            })
                          }
                          placeholder="Dr. Sharma"
                          className="w-full bg-blue-900 border border-slate-800/50 p-3 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    {/* BUTTON */}
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={addClassToRoutine}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all"
                      >
                        Add Class
                      </button>
                    </div>
                  </div>
                </ActionCard>
              </div>
            )}

            {/* --- SUBJECTS TAB --- */}
            {activeTab === "Subjects" && (
              <ActionCard
                title="Subject Management"
                icon={LayoutGrid}
                badge={`${subjects.length} subjects`}
              >
                <p className="text-xs text-slate-500 mt-2 italic">
                  Manage your semester subjects. These will be used in routine
                  and attendance tracking.
                </p>

                {/* SUBJECT LIST */}
                <div className="space-y-3 mt-8">
                  {subjects.map((sub) => (
                    <div
                      key={sub._id}
                      className="flex gap-4 items-center bg-[#1c1e26] p-3 rounded-xl border border-slate-800/50 group relative"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500" />

                      {/* 🔥 EDIT MODE */}
                      {editId === sub._id ? (
                        <div className="flex flex-col flex-1 gap-2">
                          <input
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            className="bg-[#111218] p-2 rounded text-xs"
                            placeholder="Subject Name"
                          />

                          <input
                            value={editData.code}
                            onChange={(e) =>
                              setEditData({ ...editData, code: e.target.value })
                            }
                            className="bg-[#111218] p-2 rounded text-xs"
                            placeholder="Code"
                          />

                          <input
                            value={editData.faculty}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                faculty: e.target.value,
                              })
                            }
                            className="bg-[#111218] p-2 rounded text-xs"
                            placeholder="Faculty"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col flex-1">
                          <span className="font-bold text-sm text-slate-200">
                            {sub.name}
                          </span>

                          <span className="text-[10px] text-slate-500">
                            {sub.code || "No Code"} •{" "}
                            {sub.faculty || "No Faculty"}
                          </span>
                        </div>
                      )}

                      {/* 🔥 ACTION BUTTONS */}
                      {editId === sub._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateSubject}
                            className="text-green-400 text-xs font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="text-gray-400 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => startEdit(sub)}
                            className="text-blue-400 text-xs font-bold"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteSubject(sub._id)}
                            className="text-red-400 text-xs font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* EMPTY STATE */}
                  {subjects.length === 0 && (
                    <div className="text-center text-slate-500 text-xs italic py-6 border border-dashed border-slate-800/40 rounded-xl">
                      No subjects added yet
                    </div>
                  )}
                </div>

                {/* ADD SUBJECT */}
                {/* ADD SUBJECT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {/* SUBJECT NAME */}
                  <input
                    value={newSubject.name}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, name: e.target.value })
                    }
                    placeholder="Subject Name (DBMS)"
                    className="bg-[#111218] border border-slate-800/50 p-4 rounded-xl text-xs font-bold text-slate-200"
                  />

                  {/* SUBJECT CODE */}
                  <input
                    value={newSubject.code}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, code: e.target.value })
                    }
                    placeholder="Code (CS401)"
                    className="bg-[#111218] border border-slate-800/50 p-4 rounded-xl text-xs font-bold text-slate-200"
                  />

                  {/* FACULTY */}
                  <input
                    value={newSubject.faculty}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, faculty: e.target.value })
                    }
                    placeholder="Faculty (Dr. Sharma)"
                    className="bg-[#111218] border border-slate-800/50 p-4 rounded-xl text-xs font-bold text-slate-200"
                  />
                </div>

                <button
                  onClick={handleAddSubject}
                  className="mt-4 px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  Add Subject
                </button>
              </ActionCard>
            )}

            {/* --- SECURITY TAB --- */}
            {activeTab === "Security" && (
              <ActionCard
                title="Security & Privacy"
                icon={Shield}
                badge="Protected"
              >
                <div className="space-y-6 mt-8">
                  <ToggleItem
                    title="Two-Factor Auth"
                    desc="Extra protection for your account"
                    active
                  />
                  <ToggleItem
                    title="Session Persistence"
                    desc="Stay logged in across devices"
                    active
                  />
                  <ToggleItem
                    title="Analytics & Insights"
                    desc="Help improve CAMPUS.OS"
                  />
                  <ToggleItem
                    title="Email Notifications"
                    desc="Alerts for low attendance"
                    active
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800/50">
                    <ControlInput
                      type="password"
                      label="Current Password"
                      placeholder="••••••••"
                    />
                    <ControlInput
                      type="password"
                      label="New Password"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button className="px-8 py-3 bg-[#1c1e26] border border-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800">
                      Update Security
                    </button>
                  </div>
                </div>
              </ActionCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatMini = ({ label, sub }) => (
  <div className="text-center">
    <p className="text-lg font-black text-black italic">{label}</p>
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
      {sub}
    </p>
  </div>
);

const ActionCard = ({ title, icon: Icon, badge, children }) => (
  <div className="bg-blue-100 border border-slate-800/50 rounded-[2rem] p-8 shadow-sm">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-[#1c1e26] text-blue-500 rounded-xl border border-slate-800/50">
          <Icon size={18} />
        </div>
        <h3 className="font-black text-sm uppercase tracking-[0.1em] text-slate-200">
          {title}
        </h3>
      </div>
      {badge && (
        <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-green-500/20">
          {badge}
        </span>
      )}
    </div>
    {children}
  </div>
);

const ControlInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full bg-blue-900 border border-slate-800/50 p-3.5 rounded-xl text-sm font-bold text-slate-300 outline-none focus:border-blue-500/50 focus:bg-[#23252e] transition-all ${className}`}
    />
  </div>
);

const ToggleItem = ({ title, desc, active = false }) => (
  <div className="flex items-center justify-between group">
    <div>
      <p className="text-sm font-bold text-slate-200">{title}</p>
      <p className="text-[10px] text-slate-500 font-medium">{desc}</p>
    </div>
    <div
      className={`w-12 h-6 rounded-full relative p-1 transition-all ${active ? "bg-blue-600" : "bg-slate-800"}`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? "translate-x-6" : "translate-x-0"}`}
      />
    </div>
  </div>
);

export default SmartSettings;
