import { useEffect, useState } from "react";
import {
  Download,
  Smartphone,
  Monitor,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

let deferredPrompt;

const DownloadPage = () => {
  const [installAvailable, setInstallAvailable] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isInstalled) return;

    const handler = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setInstallAvailable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("QUESTLY Installed");
    }
    deferredPrompt = null;
    setInstallAvailable(false);
    setTimeout(() => setInstalling(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] overflow-x-hidden text-slate-900 selection:bg-blue-100">
      {/* BACKGROUND DECORATIONS - Optimized for performance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[-10%] w-[300px] md:w-[40%] h-[40%] bg-blue-500/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-10%] w-[300px] md:w-[35%] h-[35%] bg-indigo-500/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />
      </div>

      <Navbar />

      <div className="flex relative z-10">
        {/* SIDEBAR - Desktop Only */}
        
   <div className="hidden lg:block">
          <Sidebar />
        </div>
      

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-24">
            
            {/* HERO SECTION */}
            <section className="text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
                <Sparkles size={14} className="text-blue-600" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                  Download Center
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[1.1] max-w-4xl">
  Download
  <span className="text-blue-600 ml-3">QUESTLY</span>
</h1>

              <p className="mt-6 text-slate-500 text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed px-4">
                Transform your academic workflow into a smarter, faster, and
                distraction-free productivity experience.
              </p>

              {/* TAGS - Scrollable on mobile if they overflow */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-10 px-2">
                {[
                  "Attendance AI",
                  "Team Projects",
                  "Installable App",
                  "Smart Workspace",
                ].map((item) => (
                  <div
                    key={item}
                    className="px-3 md:px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-xs md:text-sm font-bold text-slate-700 shadow-sm whitespace-nowrap"
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* APP MOCKUP - Responsive scale and rotation */}
              <div className="relative flex justify-center mt-16 md:mt-24 w-full max-w-md mx-auto">
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="w-full h-full bg-blue-500/20 blur-[80px] md:blur-[120px] rounded-full scale-110" />
                </div>

                <div className="relative w-[240px] sm:w-[280px] md:w-[340px] rounded-[2.5rem] md:rounded-[3.5rem] border-[8px] md:border-[12px] border-slate-900 bg-white shadow-2xl overflow-hidden rotate-[-3deg] md:rotate-[-6deg] hover:rotate-0 transition-all duration-500 ease-out">
                  <img
                    src="/preview.jpeg"
                    alt="QUESTLY Preview"
                    className="w-full aspect-[9/19] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </section>

            {/* FEATURES GRID - 1 col Mobile, 2 col Tablet, 3 col Desktop */}
            <section className="mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: Smartphone,
                  title: "Mobile Optimized",
                  desc: "Install QUESTLY directly on your home screen for instant access anytime.",
                },
                {
                  icon: Monitor,
                  title: "Desktop Experience",
                  desc: "Use QUESTLY like a premium desktop productivity application.",
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  desc: "Smooth, responsive, and distraction-free experience across all devices.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group bg-white/70 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="text-blue-600" size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </section>

            {/* INSTALL CTA SECTION */}
            <section className="mt-32 px-2">
              <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-8 md:p-20 shadow-2xl shadow-blue-500/20 text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-8">
                    <Download className="text-white" size={32} />
                  </div>

                  <h2 className="text-3xl md:text-6xl font-black text-white tracking-tight">
                    Install QUESTLY
                  </h2>

                  <p className="text-blue-100 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-medium mt-6 mb-12 opacity-90">
                    Add QUESTLY to your home screen and launch your academic
                    workspace like a native application.
                  </p>

                  {installAvailable ? (
                    <button
                      onClick={handleInstall}
                      className="group relative inline-flex items-center gap-3 bg-white text-blue-700 px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <Download size={20} />
                        {installing ? "Installing..." : "Install Now"}
                      </span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-6 md:px-8 py-4">
                      <CheckCircle2 className="text-green-300 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-white font-black text-sm md:text-base">QUESTLY Ready</p>
                        <p className="text-blue-100 text-xs md:text-sm">Launch from your home screen</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* EXPERIENCE SECTION - Image/Text swap logic */}
            <section className="mt-32 grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />
                <div className="relative bg-white border border-slate-200 rounded-[2rem] md:rounded-[3rem] p-3 md:p-4 shadow-2xl overflow-hidden">
                  <img
                    src="/dashboard-preview.png"
                    alt="Dashboard Preview"
                    className="rounded-[1.5rem] md:rounded-[2.5rem] w-full"
                  />
                </div>
              </div>

              <div className="order-1 lg:order-2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-black text-[10px] tracking-[0.2em] uppercase mb-6">
                  <ShieldCheck size={14} />
                  App Experience
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                  Built for smarter students.
                </h2>
                <p className="mt-6 text-slate-500 text-base md:text-lg leading-relaxed font-medium">
                  QUESTLY combines attendance insights, academic tools, and
                  collaborative workspaces into one seamless experience.
                </p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {[
                    "Distraction-free workspace",
                    "Lightning fast performance",
                    "Installable on any device",
                    "Smart attendance insights",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-4 justify-center lg:justify-start">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="text-blue-600" size={16} />
                      </div>
                      <p className="font-bold text-slate-700 text-sm md:text-base">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* STEPS SECTION */}
            <section className="mt-40">
              <div className="text-center mb-16">
                <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                  Installation Guide
                </p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight">Install in seconds</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[
                  { step: "01", title: "Open QUESTLY", desc: "Visit QUESTLY using Chrome, Edge, or Brave." },
                  { step: "02", title: "Tap Install", desc: "Click the install button in the address bar." },
                  { step: "03", title: "Launch Anywhere", desc: "Open directly from your app drawer or dock." },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="relative bg-white/70 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm"
                  >
                    <div className="text-blue-600 text-xs font-black tracking-[0.2em] mb-6">{item.step}</div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                    <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">{item.desc}</p>
                    <ArrowRight className="absolute top-10 right-10 text-blue-100 hidden md:block" />
                  </div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="mt-10 border-t border-slate-200 pt-12 pb-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter">QUESTLY</h3>
                  <p className="text-slate-500 font-medium mt-1 text-sm">Built for smarter students.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs md:text-sm font-bold text-slate-400">
                  <button className="hover:text-blue-600 transition-colors uppercase tracking-widest">Privacy</button>
                  <button className="hover:text-blue-600 transition-colors uppercase tracking-widest">Support</button>
                  <button className="hover:text-blue-600 transition-colors uppercase tracking-widest">GitHub</button>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DownloadPage;