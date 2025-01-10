import { ReactNode } from "react";

export type DashboardButtonType = {
  text: string;
  start_icon?: ReactNode;
  end_icon?: ReactNode;
  className?: {
    className?: string;
    startIconClassName?: string;
    endIconClassName?: string;
    textClassName?: string;
  };
  href?: string;
  disabled?: boolean;
  isLoading: boolean;
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
};
