import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Target, BookOpen, 
  Calendar, CheckSquare, LogOut, Settings,
  Menu, X,
  Download
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/home" },
    { name: "Attendance Analytics", icon: CheckSquare, path: "/attendance" },
    { name: "SmartCompass", icon: Target, path: "/smart-compass" },
    { name: "Academic Vault", icon: BookOpen, path: "/academic" },
    { name: "Task Center", icon: Calendar, path: "/live-schedule" },
    { name: "Team Projects", icon: CheckSquare, path: "/project-camp" },
    { name: "Smart Setting", icon: Settings, path: "/smart-setting" },
    { name: "Download QUESTLY", icon: Download, path: "/download" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false); // close on click
  };

  return (
    <>
      {/* 🔥 Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <span className="font-black text-lg">CAMPUS.OS</span>
        <button onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* 🔥 Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🔥 Sidebar */}
   <aside
  className={`
    fixed lg:static top-0 left-0 z-50
    w-64 min-h-full bg-white border-r border-slate-200
    p-6 flex flex-col
    transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
>
  {/* Header */}
 

  {/* Navigation */}
  <nav className="space-y-1">
    {menuItems.map((item) => {
      const isActive = location.pathname === item.path;

      return (
        <button
          key={item.name}
          onClick={() => handleNavigate(item.path)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            isActive
              ? "bg-blue-600 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <item.icon size={18} />
          {item.name}
        </button>
      );
    })}
  </nav>

  {/* 🔥 PUSH EVERYTHING ABOVE */}
  <div className="mt-auto pt-6 border-t border-slate-100">
    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 text-sm font-bold fixed bottom-0 z-55">
      <LogOut size={18} />
      Logout
    </button>
  </div>
</aside>
    </>
  );
};

export default Sidebar;