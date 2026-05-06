import { useEffect, useState } from "react";
import {
  Download,
  Smartphone,
  Monitor,
  Zap,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

let deferredPrompt;

const DownloadPage = () => {
  const [installAvailable, setInstallAvailable] = useState(false);

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
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("QUESTLY Installed");
    }
    deferredPrompt = null;
    setInstallAvailable(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8] text-slate-800 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[5%] -left-[10%] w-[60%] md:w-[40%] h-[40%] bg-blue-400/20 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[50%] md:w-[30%] h-[30%] bg-indigo-400/20 blur-[80px] md:blur-[100px] rounded-full" />
      </div>

      <Navbar />

      <div className="flex flex-1 relative z-10">
        {/* SIDEBAR - Hidden on mobile, visible on LG screens */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar />
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 md:py-20">
            
            {/* HERO SECTION */}
            <div className="text-center mb-12 md:mb-20">
              <p className="text-blue-600 font-black uppercase tracking-[0.25em] text-[9px] md:text-xs mb-4">
                Download Center
              </p>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">
                Download
                <span className="text-blue-600 inline ml-3">QUESTLY</span>
              </h1>

              <p className="mt-3 md:mt-6 text-slate-500 text-[11px] md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                Install QUESTLY on your device and turn your academic workflow into
                a smarter, faster, and distraction-free experience.
              </p>
            </div>

            {/* FEATURES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
              {[
                {
                  icon: Smartphone,
                  title: "Mobile Ready",
                  desc: "Install QUESTLY directly on your Android or iPhone home screen.",
                },
                {
                  icon: Monitor,
                  title: "Desktop Support",
                  desc: "Use QUESTLY like a desktop productivity application.",
                },
                {
                  icon: Zap,
                  title: "Fast Experience",
                  desc: "Launch instantly with a smooth app-like interface.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-100 flex items-center justify-center mb-4 md:mb-6">
                    <item.icon className="text-blue-600" size={24} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2 md:mb-3">
                    {item.title}
                  </h2>
                  <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* INSTALL CTA SECTION */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-center shadow-xl md:shadow-2xl shadow-blue-500/20">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-6 md:mb-8">
                <Download className="text-white" size={32} />
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Install QUESTLY
              </h2>

              <p className="text-blue-100 text-sm md:text-lg max-w-xl mx-auto leading-relaxed font-medium mb-8 md:mb-10">
                Add QUESTLY to your home screen and enjoy a distraction-free student
                productivity experience with one tap.
              </p>

              {installAvailable ? (
                <button
                  onClick={handleInstall}
                  className="inline-flex items-center gap-3 bg-white text-blue-700 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl hover:scale-[1.03] active:scale-95 transition-all"
                >
                  <Download size={20} />
                  Install QUESTLY
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl">
                    <CheckCircle2 size={18} />
                    <span className="font-bold text-sm md:text-base">
                      QUESTLY Already Installed
                    </span>
                  </div>
                  <p className="text-blue-100/70 text-xs md:text-sm">
                    Open in Chrome or Edge if installation is unavailable.
                  </p>
                </div>
              )}
            </div>

            {/* HOW TO INSTALL STEPS */}
            <div className="mt-16 md:mt-24">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-8 md:mb-12">
                How to Install
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[
                  {
                    step: "01",
                    title: "Open QUESTLY",
                    desc: "Open the QUESTLY website in Chrome, Edge, or Brave browser.",
                  },
                  {
                    step: "02",
                    title: "Tap Install",
                    desc: "Click the install button or browser install prompt.",
                  },
                  {
                    step: "03",
                    title: "Launch Anytime",
                    desc: "Open QUESTLY directly from your home screen like an app.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm"
                  >
                    <p className="text-blue-600 text-[10px] md:text-sm font-black tracking-[0.2em] mb-3 md:mb-4">
                      {item.step}
                    </p>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 md:mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DownloadPage;