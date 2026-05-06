import { useEffect, useState } from "react";

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

      setTimeout(() => {
        setVisible(true);
      }, 3000);
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

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[999] bg-white border border-slate-200 rounded-2xl p-4 shadow-xl flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-700">
        Install QUESTLY for a better experience 🚀
      </p>

      <button
        onClick={handleInstall}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm"
      >
        Install
      </button>
    </div>
  );
};

export default InstallPrompt;