"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PanelSetting() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/panel_setting/robot_settings");
  }, []);

  return null;
}
