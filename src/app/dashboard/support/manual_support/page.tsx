"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import ViewUserProfile from "@/components/view_user_profile";
import { useAuth } from "@/contexts/authContext";
import { useBotSupport } from "@/contexts/botSupportContext";
import { useController } from "@/contexts/controllerContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ManualSupport() {
  const [telegramId, setTelegramId] = useState("");
  const [userInfo, setUserInfo] = useState<object>({});
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { user } = useAuth();
  const { isLoadingSupport, support, setSupport } = useBotSupport();
  const { addAlert, addLink, removeLink } = useController();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const isSetLink = useRef(false);

  useEffect(() => {
    receiverEvent("userAvailableEventReceiver", (data) => {
      if (data.success === false) return addAlert(data.message, "error");

      setUserInfo(data.data);
      setOpen(true);
    });
  }, []);

  useEffect(() => {
    if (!support || isLoadingSupport) return;

    setTelegramId(String(support.supportId));
  }, [support, isLoadingSupport]);

  useEffect(() => {
    if (!open) setUserInfo({});
  }, [open]);

  useEffect(() => {
    receiverEvent("supportEventReceiver", (data) => {
      if (!data.success) return addAlert(data.message, "error");

      stopLoading();
      setSupport(data.data);
      addAlert("آیدی با موفقیت اعمال شد");
    });
  }, []);

  const handleSendEvent = useCallback(() => {
    if (!user) return;
    if (!telegramId) return;
    if (isLoadingSupport) return;

    startLoading();

    if (!support)
      return sendEvent("createSupport", {
        userId: user.userId,
        botId: user.botId,
        provider: "manual",
        supportId: telegramId,
      });

    return sendEvent("updateSupport", {
      userId: user.userId,
      botId: user.botId,
      provider: "manual",
      supportId: telegramId,
    });
  }, [user, support, isLoadingSupport, telegramId]);

  return (
    <div className="flex gap-3 flex-col items-center justify-center">
      <div className="flex items-center justify-end w-[91%]">
        <Button
          className="border-[#D6D6D6] w-[10%] h-[6.5vh] border-2"
          onClick={() => {
            router.back();
            removeLink("support");
          }}
          disabled={isLoadingSupport || isLoading}
        >
          بازگشت
        </Button>
      </div>

      <div className="w-full flex items-center justify-center gap-5">
        <div className="w-[80%]">
          <Input
            className="h-[6.5vh] border-[#D6D6D6] border-2"
            placeholder="آیدی تلگرام پشتیبانی را وارد کنید"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            disabled={isLoadingSupport || isLoading}
          />
        </div>

        <div>
          <LoadingButton
            className="border-[#D6D6D6] h-[6.5vh] border-2"
            variant={"ghost"}
            onClick={handleSendEvent}
            disabled={!telegramId || isLoadingSupport || isLoading}
          >
            اعمال آیدی
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
