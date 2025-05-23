import { DashboardButtonType } from "@/types/dashboard_button_type";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

interface props extends DashboardButtonType {}

export default function DashboardButton({
  text,
  start_icon,
  end_icon,
  className,
  href,
  disabled,
  isLoading,
  onClick,
  onMouseOver,
  onMouseOut,
}: props) {
  // Prevent default action if disabled
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled || isLoading) {
      e.preventDefault(); // Prevent the link from being followed
    } else {
      onClick && onClick(); // Call onClick if available and not disabled
    }
  };

  return isLoading ? (
    <div className="w-[326px] h-[63.5px]">
      <Skeleton className="w-full h-full rounded-full bg-black/40" />
    </div>
  ) : (
    <Link
      className={`text-black text-[17px] w-[326px] h-[63.5px] flex items-center justify-between p-5 rounded-full transition-all ease-in-out duration-75 ${
        !disabled
          ? className?.className
          : "bg-black/20 opacity-[.5] cursor-not-allowed"
      }`}
      href={href || "#"}
      role="button"
      onMouseOver={() => {
        !disabled && onMouseOver ? onMouseOver() : null;
      }}
      onMouseOut={() => {
        !disabled && onMouseOut ? onMouseOut() : null;
      }}
      aria-disabled={disabled}
      onClick={handleClick} // Handle click event
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
