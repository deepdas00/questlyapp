import { useEffect, useState } from "react";
import { X, Download, Sparkles } from "lucide-react";

let deferredPrompt = null;

const InstallPrompt = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isInstalled) return;

    const handler = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Delay appearance for better UX
      const timer = setTimeout(() => {
        setVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("QUESTLY Installed");
    }

    deferredPrompt = null;
    setVisible(false);
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-[999] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-blue-300 backdrop-blur-xl border border-blue-100 rounded-[2rem] p-4 md:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-4">
        
        {/* APP ICON MINI */}
        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-blue-600 items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
           <Download className="text-white" size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Questly App</span>
          </div>
          <p className="text-slate-900 font-bold text-sm md:text-base truncate">
            Install for a faster experience
          </p>
          <p className="text-slate-500 text-xs font-medium">
            Launch directly from your home screen.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstall}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-sm transition-all active:scale-95 shadow-md shadow-blue-100"
          >
            Install
          </button>
          
          <button 
            onClick={handleDismiss}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;