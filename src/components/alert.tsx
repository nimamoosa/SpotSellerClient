import { useController } from "@/contexts/controllerContext";
import { toast as Toast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function Alert() {
  const { openToast, setOpenToast, toast } = useController();

  useEffect(() => {
    Toast({
      // open: false,
      onOpenChange: setOpenToast,
      dir: "rtl",
      title: toast?.title,
      description: toast.description,
      duration: 5000,
    });
  }, [openToast, toast, setOpenToast]);
}
