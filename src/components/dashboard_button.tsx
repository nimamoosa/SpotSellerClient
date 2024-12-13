import { DashboardButtonType } from "@/types/dashboard_button_type";
import Link from "next/link";

interface props extends DashboardButtonType {}

export default function DashboardButton({
  text,
  start_icon,
  end_icon,
  className,
  href,
  onClick,
  onMouseOver,
  onMouseOut,
}: props) {
  return (
    <Link
      className={`text-black text-[17px] w-[326px] flex items-center justify-between h-[63.5px] p-5 rounded-full transition-all ease-in-out duration-75 ${className?.className}`}
      href={href || "#"}
      role="button"
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <section slot="main" className="flex">
        <div
          className={`bg-transparent text-white flex items-center justify-center rounded-full ${className?.startIconClassName}`}
        >
          {start_icon}
        </div>
        <div
          className={`flex items-center justify-center mr-2 text-[17px] font-medium ${className?.textClassName}`}
        >
          {text}
        </div>
      </section>

      <section slot="end_icon">
        <div
          className={`ml-1 text-blue-600  ${className?.endIconClassName} text-2xl`}
        >
          {end_icon}
        </div>
      </section>
    </Link>
  );
}
