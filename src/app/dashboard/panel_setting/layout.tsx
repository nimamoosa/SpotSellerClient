"use client";

import Link from "next/link";
import { useState, useEffect, useRef, ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { useBot } from "@/contexts/botContext";
import { Skeleton } from "@/components/ui/skeleton";

interface Tab {
  label: string;
  href: string;
  segment: string; // بخش مرتبط از مسیر
}

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});
  const tabsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const segment = useSelectedLayoutSegment();

  const { isLoadingBots } = useBot();

  const tabs: Tab[] = [
    {
      label: "تنظیمات ربات",
      href: "/dashboard/panel_setting/robot_settings",
      segment: "robot_settings",
    },
    {
      label: "سامانه پیامکی",
      href: "/dashboard/panel_setting/sms_system",
      segment: "sms_system",
    },
    {
      label: "تنظیمات اطلاعات عمومی",
      href: "/dashboard/panel_setting/general_settings",
      segment: "general_settings",
    },
  ];

  useEffect(() => {
    const currentIndex = tabs.findIndex((tab) => tab.segment === segment);
    if (currentIndex !== -1) {
      setActiveTab(currentIndex);
    }
  }, [segment]);

  useEffect(() => {
    if (tabsRef.current[activeTab]) {
      const currentTab = tabsRef.current[activeTab]!;
      setSliderStyle({
        width: `${currentTab.offsetWidth}px`,
        left: `${currentTab.offsetLeft}px`,
      });
    }
  }, [activeTab]);

  return (
    <div className="w-full flex flex-col items-center mt-3">
      <div className="flex justify-start gap-12 w-full relative border-b-[1px] border-gray-300">
        {tabs.map((tab, index) => (
          <Link
            href={tab.href}
            key={index}
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            onClick={() => setActiveTab(index)}
            className={`pb-5 text-lg transition-all duration-150 px-4 ${
              activeTab === index
                ? "text-purple-600 font-bold"
                : "text-black/70"
            }`}
          >
            {tab.label}
          </Link>
        ))}

        <div
          className="absolute bottom-0 h-[2px] bg-purple-600 transition-all duration-300"
          style={sliderStyle}
        ></div>
      </div>

      {isLoadingBots ? (
        <div className="w-full h-full flex items-center justify-center mt-5">
          <div className="flex flex-col items-center justify-center space-y-3 w-full *:w-[70%]">
            <Skeleton className="h-[125px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 w-[95%] ml-auto mr-auto">{children}</div>
      )}
    </div>
  );
}
