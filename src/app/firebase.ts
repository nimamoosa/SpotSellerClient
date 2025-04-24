import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWc5FE43hxifWLAZ2Hy86Ooo6hk0lv5E8",
  authDomain: "spotsellerbot.firebaseapp.com",
  projectId: "spotsellerbot",
  storageBucket: "spotsellerbot.firebasestorage.app",
  messagingSenderId: "820444177083",
  appId: "1:820444177083:web:2c8713ec245d5fc0a87f9e",
  measurementId: "G-9N7X37E5XW",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
