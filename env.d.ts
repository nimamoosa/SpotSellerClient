declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ENC_SECRET: string;
    }
  }
}

export {};
