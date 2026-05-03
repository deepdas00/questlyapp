import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Target,
  BookOpen,
  Calendar,
  CheckSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import logo from "../assets/logoNavFinal.jpg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  // 🛡️ Prevent background scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const menuItems = isLoggedIn
    ? [
        { name: "Dashboard", icon: LayoutDashboard, path: "/home" },
        { name: "Attendance", icon: CheckSquare, path: "/attendance" },
        { name: "SmartCompass", icon: Target, path: "/smart-compass" },
        { name: "Academic Vault", icon: BookOpen, path: "/academic" },
        { name: "Live Schedule", icon: Calendar, path: "/live-schedule" },
        { name: "Project Camp", icon: CheckSquare, path: "/project-camp" },
        { name: "Smart Setting", icon: Settings, path: "/smart-setting" },
      ]
    : [
        { name: "Features", path: "#features" },
        { name: "Academics", path: "#academics" },
        { name: "Assignments", path: "#assignments" },
        { name: "Login", path: "/login" },
        { name: "Register", path: "/register" },
      ];

  const handleNav = (path) => {
    if (path.startsWith("#")) {
      document.querySelector(path)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(path);
    }
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔥 Login
      await API.post("/auth/login", formData);

      // 🔥 Get user from cookie
      const res = await API.get("/auth/check");

      setUser(res.data.user);

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const { setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await API.post("/auth/logout");
    setUser(null);
    navigate("/");
  };

  const isLandingPage = location.pathname === "/";

  return (
    <>
      {/* 🔝 NAVBAR */}
      <header className="w-full sticky top-0 z-[60] bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-1.5 md:px-8 md:py-2">
          {/* Logo */}
          <div className="flex items-center gap-2 lg:gap-3">
            <img
              src={logo}
              alt="Questly Logo"
              className="w-8 h-8 lg:w-11 lg:h-11 object-cover rounded-xl"
            />

            <span className="font-black text-[15px] lg:text-xl tracking-tight text-slate-800">
              QUESTLY
            </span>
          </div>

          {/* Desktop Nav would go here, Mobile toggle below */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-4 h-4 text-slate-600" strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* 🌑 COOL BACKDROP */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] transition-opacity duration-500 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* 📱 TRENDY FLOATING DRAWER */}
      <div
        className={`
          fixed top-1 right-0 bottom-1 z-[80] w-[280px] 
          bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
          rounded-[1.3rem] rounded-r-[0rem] flex flex-col overflow-hidden
          transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${open ? "translate-x-0 scale-100 opacity-100" : "translate-x-[110%] scale-95 opacity-0"}
        `}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-7 pb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/60">
              Menu
            </span>
            <span className="text-xl font-black text-slate-800">
              Navigation
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2.5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => handleNav(item.path)}
                style={{ transitionDelay: open ? `${idx * 40}ms` : "0ms" }}
                className={`
                  w-full flex items-center justify-between px-5 py-4 rounded-[1.5rem] font-bold text-sm
                  transition-all duration-300 group relative
                  ${open ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
                  ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                      : "text-slate-500 hover:bg-white hover:shadow-sm"
                  }
                `}
              >
                <div className="flex items-center gap-3.5">
                  {item.icon && (
                    <item.icon
                      size={18}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={isActive ? "text-blue-400" : "text-slate-400"}
                    />
                  )}
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Logout Section */}
        {isLoggedIn && (
          <div className="p-5 mt-auto">
            <div className="bg-slate-50 rounded-[2rem] p-1.5 border border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-4 text-red-500 font-black text-sm rounded-[1.6rem] hover:bg-white hover:shadow-sm transition-all group"
              >
                <LogOut
                  size={18}
                  strokeWidth={3}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Logout Account
              </button>
            </div>
            <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-5 mb-0">
              Campus.OS v2.0
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
