import { Skeleton } from "./ui/skeleton";

export default function ToggleButton({
  loading,
  disabled,
  readonly,
  active,
  active_text,
  inactive_text,
  onClick,
  active_class,
  inactive_class,
}: {
  loading: boolean;
  disabled: boolean;
  readonly?: boolean;
  active: boolean;
  active_text: string;
  inactive_text: string;
  onClick?: () => void;
  active_class?: string;
  inactive_class?: string;
}) {
  return (
    <div>
      {loading ? (
        <Skeleton className="w-[75px] h-[30px] rounded-full" />
      ) : (
        <button
          className={`bg-[#F6F6F6] transition-all border-2 border-[#519506] flex justify-around items-center w-[80px] h-[30px] rounded-full disabled:opacity-[.5] disabled:cursor-not-allowed ${
            readonly ? "cursor-default" : ""
          }`}
          disabled={disabled}
          onClick={!readonly ? onClick : undefined}
        >
          {active ? (
            <div className="flex items-center justify-evenly w-full">
              <div className="bg-[#519506] rounded-full w-[28px] h-[19px] animate-pulse" />
              <div className={active_class}>
                <p>{active_text}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-evenly w-full">
              <div className={inactive_class}>
                <p>{inactive_text}</p>
              </div>
              <div className="bg-[#519506] rounded-full w-[28px] h-[19px] animate-pulse" />
            </div>
          )}
        </button>
      )}
    </div>
  );
}
