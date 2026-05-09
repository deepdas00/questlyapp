self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
});


self.addEventListener("push", (event) => {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/logo.png",
  });
});