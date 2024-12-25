declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ENC_SECRET: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_API_KEY: string;
    }
  }
}

export {};
