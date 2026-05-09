export const subscribeUser = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    alert("Enable notifications");
    return;
  }

  const reg = await navigator.serviceWorker.ready;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: import.meta.env.VITE_PUBLIC_VAPID_KEY,
  });

  await fetch("http://localhost:5000/api/push/subscribe", {
    method: "POST",
    body: JSON.stringify(sub),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("Subscribed successfully ✅");
};