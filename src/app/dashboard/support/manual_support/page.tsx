"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import ViewUserProfile from "@/components/view_user_profile";
import { useAuth } from "@/contexts/authContext";
import { useBotSupport } from "@/contexts/botSupportContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ManualSupport() {
  const [telegramId, setTelegramId] = useState("");
  const [userInfo, setUserInfo] = useState<object>({});
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { user } = useAuth();
  const { support, isLoadingSupport } = useBotSupport();
  const { isLoading } = useLoading();

  useEffect(() => {
    receiverEvent("userAvailableEventReceiver", (data) => {
      if (data.success === false) return alert(data.message);

      setUserInfo(data.data);
      setOpen(true);
    });
  }, []);

  useEffect(() => {
    if (!support || isLoadingSupport) return;

    setTelegramId(String(support.supportId));
  }, [support, isLoadingSupport]);

  const handleClickSet = useCallback(() => {
    if (!user) return;
    if (!telegramId) return;

    sendEvent("userAvailable", { userId: user.userId, telegramId });
  }, [user, telegramId]);

  useEffect(() => {
    if (!open) setUserInfo({});
  }, [open]);

  return (
    <div className="flex gap-3 flex-col items-center justify-center">
      <ViewUserProfile
        open={open}
        setOpen={setOpen}
        profile={userInfo}
        telegramId={telegramId}
      />

      <div className="flex items-center justify-end w-[89%]">
        <Button
          onClick={() => router.back()}
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
            className="border-[#D6D6D6] border-2"
            variant={"ghost"}
            onClick={handleClickSet}
            disabled={isLoadingSupport || isLoading}
          >
            اعمال آیدی
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
