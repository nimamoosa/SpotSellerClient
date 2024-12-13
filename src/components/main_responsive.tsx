"use client";

import { ReactNode, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Alert from "./alert";

export default function MainResponsive({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const responsive = useMediaQuery({ query: "(max-width: 1295px)" });

  if (!isClient) {
    // در زمان SSR هیچ چیز باز نمی‌گردد تا هیدریشن متناسب باشد
    return null;
  }

  return (
    <div className="w-full h-[100vh] max-w-[1600px] ml-auto mr-auto">
      <Alert />
      {/* {responsive ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-2xl">
            لطفا برای استفاده از spotseller از لپ تاپ یا کامپیوتر وارد شوید
          </p>
        </div>
      ) : ( */}
      {children}
      {/* )} */}
    </div>
  );
}
