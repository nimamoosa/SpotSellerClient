"use client";

import DashboardButton from "@/components/dashboard_button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";
import { usePathname } from "next/navigation"; // Import usePathname
import { ReactNode, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";

export default function MainLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname(); // Get the current path
  const [hover, setHover] = useState<number>(-1);

  const { user } = useAuth();

  const buttons: {
    hover_icon: ReactNode;
    out_icon: ReactNode;
    text: string;
    href: string;
  }[] = [
    {
      hover_icon: <img src="/icons/house_hover.svg" className="object-cover" />,
      out_icon: (
        <img src="/icons/house_out.svg" className="fill-none object-cover" />
      ),
      text: "داشبورد",
      href: "/dashboard",
    },
    {
      hover_icon: <img src="/icons/play_hover.svg" className="object-cover" />,
      out_icon: (
        <img src="/icons/play_out.svg" className="fill-none object-cover" />
      ),
      text: "مدیریت دوره ها",
      href: "/dashboard/management_of_courses",
    },
    {
      hover_icon: (
        <img src="/icons/person_hover.svg" className="object-cover" />
      ),
      out_icon: <img src="/icons/person_out.svg" alt="users" />,
      text: "مدیریت کاربران",
      href: "/dashboard/management_users",
    },
    {
      hover_icon: <img src="/icons/support_hover.svg" />,
      out_icon: <img src="/icons/support_out.svg" />,
      text: "پشتیبانی",
      href: "/dashboard/support",
    },
    {
      hover_icon: <img src="/icons/license_hover.svg" />,
      out_icon: <img src="/icons/license.svg" />,
      href: "/dashboard/license",
      text: "لایسنس",
    },
    {
      hover_icon: <img src="/icons/cart_shop_hover.svg" />,
      out_icon: <img src="/icons/cart_shop.svg" />,
      href: "/dashboard/finance_settings",
      text: "تنظیمات مالی",
    },
    {
      hover_icon: <img src="/icons/panel_setting_hover.svg" />,
      out_icon: <img src="/icons/panel_setting.svg" />,
      href: "/dashboard/panel_setting",
      text: "تنظیمات پنل",
    },
    {
      hover_icon: <img src="/icons/wordpress.svg" />,
      out_icon: <img src="/icons/wordpress.svg" />,
      href: "/dashboard/connect_to_wordpress",
      text: "اتصال به وردپرس",
    },
  ];

  return (
    <div className="flex flex-row overflow-hidden w-full h-[100vh] font-sans border-black/10 bg-[#F5EEFF]">
      <section className="w-[25%]">
        <aside className="w-full">
          <div className="flex justify-end mt-5">
            <div className="flex items-center justify-center w-full object-cover">
              <img
                src="/logo.svg"
                className="w-[300px] rounded-full"
                alt="icon"
              />
            </div>
          </div>

          <div className="w-full flex flex-col justify-center items-center mt-3 gap-1">
            {buttons.map((item, index) => (
              <div
                className="mt-2 flex items-center justify-center w-full"
                key={index}
              >
                <DashboardButton
                  start_icon={
                    hover === index ||
                    (item.href === "/dashboard"
                      ? pathname === item.href // دقیقاً فقط `/dashboard`
                      : pathname.startsWith(item.href)) // بقیه دکمه‌ها
                      ? item.hover_icon
                      : item.out_icon
                  }
                  end_icon={
                    <img
                      src={
                        (item.href === "/dashboard"
                          ? pathname === item.href
                          : pathname.startsWith(item.href)) || hover === index
                          ? "/icons/arrow.up.left 2.svg"
                          : "/icons/arrow.up.left 1.svg"
                      }
                    />
                  }
                  text={item.text}
                  href={item.href}
                  className={{
                    className: `${
                      (
                        item.href === "/dashboard"
                          ? pathname === item.href
                          : pathname.startsWith(item.href)
                      )
                        ? "bg-[#7D35E2]"
                        : "bg-white hover:bg-[#955AE8] hover:text-white"
                    }`,
                    endIconClassName: `${
                      (
                        item.href === "/dashboard"
                          ? pathname === item.href
                          : pathname.startsWith(item.href)
                      )
                        ? "text-white"
                        : ""
                    }`,
                    textClassName: `${
                      (
                        item.href === "/dashboard"
                          ? pathname === item.href
                          : pathname.startsWith(item.href)
                      )
                        ? "text-white"
                        : ""
                    }`,
                    startIconClassName: `${
                      (
                        item.href === "/dashboard"
                          ? pathname === item.href
                          : pathname.startsWith(item.href)
                      )
                        ? "text-black"
                        : ""
                    }`,
                  }}
                  onClick={() => setHover(index)}
                  onMouseOut={() => setHover(-1)}
                  onMouseOver={() => setHover(index)}
                />
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="flex flex-col items-center justify-center w-[75%]">
        <header className="w-full h-[80px] flex items-center justify-between p-5">
          <section className="flex gap-5">
            <div>
              <span className="font-bold font_sa text-xl" dir="ltr">
                عزیز, خوش اومدی 👋 {user?.name}
              </span>
            </div>
          </section>
          <section>
            <div>
              <Button
                variant={"ghost"}
                className="flex items-center justify-center gap-2 text-[18px] focus-visible:bg-transparent hover:bg-transparent hover:text-red-500"
              >
                خروج از حساب
              </Button>
            </div>
          </section>
        </header>

        <main className="w-full h-[95%] rounded-tr-[37px] bg-white p-3">
          <section slot="top" className="mr-1 h-[10vh]">
            <div className="flex items-center w-[97%] h-[8vh] ml-auto mr-auto text-xl font-semibold mb-5">
              پنل ناشر <BsArrowLeft className="ml-2 mr-2" size={20} />{" "}
              <span>
                {buttons.find((button) => button.href === pathname)?.text || ""}
              </span>
            </div>
          </section>

          <section
            className="w-[97%] h-[90%] ml-auto mr-auto"
            suppressHydrationWarning
          >
            {children}
          </section>
        </main>
      </section>
    </div>
  );
}
