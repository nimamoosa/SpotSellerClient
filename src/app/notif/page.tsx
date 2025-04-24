"use client";

import { Button } from "@/components/ui/button";
import useFcmToken from "@/hooks/useFcmToken";
import { useSocketRequest } from "@/hooks/useSocketRequest";

export default function Home() {
  const { token, notificationPermissionStatus } = useFcmToken();
  const { sendEvent, receiverEvent } = useSocketRequest();

  const handleTestNotification = async () => {
    sendEvent("sendNotification", {
      token: token,
      title: "Test Notification",
      message: "This is a test notification",
      link: "/contact",
    });
  };

  return (
    <main className="p-10">
      <h1 className="text-4xl mb-4 font-bold">Firebase Cloud Messaging Demo</h1>

      {notificationPermissionStatus === "granted" ? (
        <p>Permission to receive notifications has been granted.</p>
      ) : notificationPermissionStatus !== null ? (
        <p>
          You have not granted permission to receive notifications. Please
          enable notifications in your browser settings.
        </p>
      ) : null}

      <Button
        disabled={!token}
        className="mt-5"
        onClick={handleTestNotification}
      >
        Send Test Notification
      </Button>
    </main>
  );
}
