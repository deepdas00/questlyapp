import { useEffect, useState } from "react";

export default function useNotificationPermission() {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  return permission;
}