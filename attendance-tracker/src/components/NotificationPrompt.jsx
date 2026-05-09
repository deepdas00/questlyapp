import { subscribeUser } from "../utils/pushNotification";
import useNotificationPermission from "../hooks/useNotificationPermission";

export default function NotificationPrompt() {
  const permission = useNotificationPermission();

  // Don't show if already allowed
  if (permission === "granted") return null;

  return (
    <div className="
      fixed bottom-4 left-1/2 -translate-x-1/2
      bg-slate-900 text-white px-4 py-3 rounded-xl
      shadow-xl flex items-center gap-3 z-50
    ">
      <p className="text-sm font-semibold">
        Enable notifications 🔔
      </p>

      <button
        onClick={subscribeUser}
        className="
          bg-blue-600 hover:bg-blue-700
          px-3 py-1.5 rounded-lg text-sm font-bold
        "
      >
        Allow
      </button>
    </div>
  );
}