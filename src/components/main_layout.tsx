"use client";

import DashboardButton from "@/components/dashboard_button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";
import { useController } from "@/contexts/controllerContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { usePathname } from "next/navigation"; // Import usePathname
import { ReactNode, useCallback, useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";

export default function MainLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname(); // Get the current path
  const [hover, setHover] = useState<number>(-1);

  const { user, setUser } = useAuth();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { addAlert, linkController } = useController();

  useEffect(() => {
    receiverEvent("logoutEventReceiver", (data) => {
      stopLoading();

      if (!data.success) {
        addAlert(data.message, "error");
        return;
      }

      setUser(null);
    });
  }, []);

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
      hover_icon: <img src="/icons/wordpress_hover.svg" />,
      out_icon: <img src="/icons/wordpress.svg" />,
      href: "/dashboard/connect_to_wordpress",
      text: "اتصال به وردپرس",
    },
  ];

  const handleSubmit = useCallback(() => {
    if (!user) return;

    startLoading();
    sendEvent("logout", { userId: user.userId });
  }, [user]);

  return (
    <div className="flex flex-row overflow-hidden w-full h-[100vh] border-black/10 bg-[#F5EEFF]">
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
                👋 <span className="font-semibold">{user?.name}</span> عزیز, خوش
                اومدی
              </span>
            </div>
          </section>
          <section>
            <div>
              <Button
                variant={"ghost"}
                className="flex items-center justify-center gap-2 text-[18px] focus-visible:bg-transparent hover:bg-transparent hover:text-red-500"
                onClick={handleSubmit}
                type="button"
                disabled={isLoading}
              >
                خروج از حساب
              </Button>
            </div>
          </section>
        </header>

        <main className="w-full h-[90%] max-h-[90%] rounded-tr-[37px] bg-white p-3">
          <section slot="top" className="h-[10vh]">
            <div className="flex items-center w-[97%] h-[8vh] ml-auto mr-auto text-xl font-semibold mb-5">
              پنل ناشر <BsArrowLeft className="ml-2 mr-2" size={20} />{" "}
              <span>
                {buttons
                  .sort((a, b) => b.href.length - a.href.length)
                  .find((button) => pathname.startsWith(button.href))?.text ||
                  ""}
              </span>
              {linkController.map((item, index) => {
                return (
                  <span
                    key={index}
                    className="flex items-center justify-center"
                  >
                    <BsArrowLeft className="ml-2 mr-2" size={20} /> {item.link}
                  </span>
                );
              })}
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
