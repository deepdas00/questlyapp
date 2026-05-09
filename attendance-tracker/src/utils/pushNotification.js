const API_URL = import.meta.env.VITE_API_URL;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;

// 🔑 Convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

export const subscribeUser = async () => {
  try {
    console.log("🚀 Subscribe started");

    // 1. Permission
    const permission = await Notification.requestPermission();
    console.log("Permission:", permission);

    if (permission !== "granted") {
      alert("Permission denied ❌");
      return;
    }

    // 2. Service Worker ready
    const reg = await navigator.serviceWorker.ready;
    console.log("SW Ready:", reg);

    // 3. Subscribe
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
    });

    console.log("✅ Subscription:", sub);

    // 4. Send to backend (DYNAMIC URL)
    const res = await fetch(`${API_URL}/push/subscribe`, {
      method: "POST",
      body: JSON.stringify(sub),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // optional (for auth cookies)
    });

    const data = await res.json();
    console.log("Saved to DB:", data);

  } catch (err) {
    console.error("❌ ERROR:", err);
  }
};