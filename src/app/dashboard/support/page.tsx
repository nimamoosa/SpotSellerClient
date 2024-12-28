"use client";

import { useController } from "@/contexts/controllerContext";
import Link from "next/link";
import { useEffect } from "react";

export default function Support() {
  const { removeLink } = useController();

  useEffect(() => {
    removeLink("support");
  }, []);

  return (
    <main className="flex items-center justify-between w-full">
      <Link
        href="/dashboard/support/manual_support"
        className="w-[48%] flex items-center justify-end"
      >
        <div className="w-full h-[330px] rounded-lg flex flex-col items-center justify-center transition-all bg-[#F6F6F6] hover:bg-[#E5E5E5]">
          <svg
            width="91"
            height="84"
            viewBox="0 0 91 84"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_418_991)">
              <path
                d="M89.539 36.6216C89.539 56.6848 70.6681 73.2028 42.2036 73.2028C41.6902 73.2028 41.1768 73.1628 40.6637 73.1224C40.111 73.1224 39.5583 73.3237 38.8871 73.8072C32.1756 78.7223 20.3713 84 15.6338 84C12.5939 84 11.7254 81.462 13.2651 79.4475C14.7653 77.4331 18.7132 73.0015 20.924 69.2952C21.2399 68.6908 21.0425 68.0864 20.4503 67.7642C7.77744 60.8346 0 49.5139 0 36.6216C0 16.3568 19.8976 0 44.7695 0C69.6417 0 89.539 16.3568 89.539 36.6216ZM57.8767 36.9842C57.8767 40.3281 60.5218 43.0275 63.7984 43.0275C66.9966 43.0275 69.7205 40.3281 69.7205 36.9842C69.7205 33.6403 66.9966 30.9411 63.7984 30.9411C60.5218 30.9411 57.8767 33.6403 57.8767 36.9842ZM38.8477 36.9842C38.8477 40.3281 41.4929 43.0275 44.7695 43.0275C48.0465 43.0275 50.6916 40.3281 50.6916 36.9842C50.6916 33.6403 48.0465 30.9411 44.7695 30.9411C41.4929 30.9411 38.8477 33.6403 38.8477 36.9842ZM19.8581 36.9842C19.8581 40.3281 22.5427 43.0275 25.78 43.0275C29.0173 43.0275 31.6624 40.3281 31.6624 36.9842C31.6624 33.6403 28.9778 30.9411 25.78 30.9411C22.5427 30.9411 19.8581 33.6403 19.8581 36.9842Z"
                fill="black"
                fillOpacity="0.85"
              />
            </g>
            <defs>
              <clipPath id="clip0_418_991">
                <rect width="91" height="84" fill="white" />
              </clipPath>
            </defs>
          </svg>

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
          <svg
            width="71"
            height="57"
            viewBox="0 0 71 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M37.4813 44.68H16.6813L12.5213 57H0.68125L21.8013 0.119998H32.2013L53.4813 57H41.6413L37.4813 44.68ZM19.5613 35.88H34.6013L27.0013 13.4L19.5613 35.88ZM70.9969 57H59.7969V0.119998H70.9969V57Z"
              fill="black"
            />
          </svg>

          <p className="text-black font-bold text-[38px]">
            پشتیبانی هوش مصنوعی
          </p>
          <span className="text-[16px] mt-1">
            پشتیبانی خودکار و هوشمند AI (قدرت گرفته از Chat GPT)
          </span>
        </div>
      </Link>
    </main>
  );
}
