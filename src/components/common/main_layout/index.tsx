"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/authContext";
import { ReactNode } from "react";

export const MainLayoutHeader = () => {
  const { loadingAuth, user } = useAuth();

  return loadingAuth ? (
    <div className="w-full h-full">
      <Skeleton className="bg-black/50 w-[20%] h-[5vh]" />
    </div>
  ) : (
    <div>
      <span className="font-bold font_sa text-xl" dir="ltr">
        👋 <span className="font-semibold">{user?.name}</span> عزیز, خوش اومدی
      </span>
    </div>
  );
};

export const MainLayoutBody = ({ children }: { children: ReactNode }) => {
  const { loadingAuth, user } = useAuth();

  return loadingAuth ? (
    <div className="w-full h-full flex flex-col items-center">
      <Skeleton className="w-full h-full relative rounded-none rounded-tr-[37px] bg-black/30" />
    </div>
  ) : (
    children
  );
};
