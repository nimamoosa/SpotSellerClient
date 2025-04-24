declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ENC_SECRET: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY: string;
    }
  }
}

export {};
