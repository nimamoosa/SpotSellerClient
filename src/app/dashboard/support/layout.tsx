"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();

  return pathname === "/dashboard/support" ? (
    <main className="flex items-center justify-between w-full">
      <Link
        href="/dashboard/support/manual_support"
        className="w-[48%] flex items-center justify-end"
      >
        <div className="w-full h-[330px] rounded-lg flex flex-col items-center justify-center transition-all bg-[#F6F6F6] hover:bg-[#E5E5E5]">
          <img src="/icons/ellipsis.message.fill 1.svg" alt="" />
          <p className="text-black font-bold text-[38px]">پشتیبانی دستی</p>
          <span className="text-[16px] mt-1">
            پشتیبانی از طریق آیدی تلگرام و چت با ادمین شما
          </span>
        </div>
      </Link>

      <Link
        href="/dashboard/support/ai_support"
        className="w-[48%] flex items-center justify-start"
      >
        <div className="w-full h-[330px] rounded-lg flex flex-col items-center justify-center transition-all bg-[#F6F6F6] hover:bg-[#E5E5E5]">
          <img src="/icons/AI.svg" alt="" />
          <p className="text-black font-bold text-[38px]">
            پشتیبانی هوش مصنوعی
          </p>
          <span className="text-[16px] mt-1">
            پشتیبانی خودکار و هوشمند AI (قدرت گرفته از Chat GPT)
          </span>
        </div>
      </Link>
    </main>
  ) : (
    children
  );
}
