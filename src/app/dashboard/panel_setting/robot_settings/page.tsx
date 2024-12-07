"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/authContext";
import { useBot } from "@/contexts/botContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { useCallback, useEffect, useState } from "react";

export default function RobotSettings() {
  const { user } = useAuth();
  const { bot, setBot, isLoadingBots } = useBot();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { isLoading, startLoading, stopLoading } = useLoading();

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

  const handleChangeBotStatus = useCallback(() => {
    if (!user) return;
    if (!bot) return;

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
  }, [user, bot]);

  return (
    <div>
      <div className="flex w-full">
        <div>
          <p>وضعیت بات</p>
        </div>

        <div className="mr-5">
          {isLoadingBots ? (
            <Skeleton className="w-[75px] h-[30px] rounded-full" />
          ) : (
            <button
              className={`bg-[#F6F6F6] transition-all border-2 border-[#519506] flex justify-around items-center w-[75px] h-[30px] rounded-full disabled:opacity-[.5]`}
              disabled={isLoading}
              onClick={handleChangeBotStatus}
            >
              <div className="bg-[#519506] rounded-full pl-3 pb-2.5 p-2 animate-pulse" />
              <div
                className={`${
                  bot?.setting.status ? "text-[15px]" : "text-[13px]"
                }`}
              >
                <p>{bot?.setting.status ? "روشن" : "خاموش"}</p>
              </div>
            </button>
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
