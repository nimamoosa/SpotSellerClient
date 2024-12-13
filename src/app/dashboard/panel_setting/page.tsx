"use client";

import ToggleButton from "@/components/toggel_button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/authContext";
import { useBot } from "@/contexts/botContext";
import { useController } from "@/contexts/controllerContext";
import { usePayment } from "@/contexts/paymentContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { useCallback, useEffect, useState } from "react";

export default function RobotSettings() {
  const { user } = useAuth();
  const { bot, setBot, isLoadingBots } = useBot();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { setAlert } = useController();
  const { payment } = usePayment();

  const [botToken, setBotToken] = useState("");

  useEffect(() => {
    if (!bot) return;

    setBotToken(bot.token);
  }, [bot]);

  useEffect(() => {
    receiverEvent("updateBotEventReceiver", (data) => {
      if (!data.success) return;

      data.result.successful.forEach((update: any) => {
        if (update.field === "settings") {
          return setBot(update.data);
        }

        if (update.field === "token") {
          return setBot(update.data);
        }
      });

      stopLoading();
    });
  }, []);

  useEffect(() => {
    !payment &&
      setAlert({
        text: "شما اول باید یک روش برای پرداخت انتخاب کنید تا بات روشن شود",
        type: "warning",
      });
  }, [payment]);

  const handleChangeBotStatus = useCallback(() => {
    if (!user) return;
    if (!bot) return;
    if (isLoading) return;

    startLoading();

    sendEvent("updateBot", {
      fields_update: [
        {
          field: "settings",
          data: { status: !bot.setting.status },
        },
      ],
      userId: user.userId,
      botId: user.botId,
      token: bot.token,
      object: { status: !bot.setting.status },
    });
  }, [user, bot, isLoading]);

  return (
    <div className="w-full">
      <div className="flex w-full">
        <div>
          <p>وضعیت بات</p>
        </div>

        <div className="mr-5">
          {bot && (
            <ToggleButton
              loading={!bot && isLoading}
              disabled={isLoading || !payment}
              onClick={handleChangeBotStatus}
              active={bot.setting.status}
              active_text="روشن"
              inactive_text="خاموش"
              inactive_class="text-[13px]"
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <Input
          dir={botToken ? "ltr" : "rtl"}
          className="h-[6vh] border-2 border-[#D6D6D6]"
          value={botToken}
          onChange={(e) => setBotToken(e.target.value)}
          placeholder="توکن ربات"
          disabled={isLoading}
          maxLength={46}
        />
      </div>

      <div className="mt-10 flex items-center justify-end">
        <Button
          className="h-[6vh] w-[120px] rounded-lg border-2 border-[#D6D6D6]"
          variant={"ghost"}
          disabled={isLoading || botToken === bot?.token}
        >
          ذخیره کردن
        </Button>
      </div>
    </div>
  );
}
