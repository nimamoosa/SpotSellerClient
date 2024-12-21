"use client";

import ToggleButton from "@/components/toggel_button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const { bot, setBot } = useBot();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { setAlert } = useController();
  const { payment } = usePayment();

  const [botToken, setBotToken] = useState("");
  const [openAlert, setOpenAlert] = useState(false);

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

  useEffect(() => {
    receiverEvent("updateBotTokenEventReceiver", (data) => {
      if (!data.success) {
        stopLoading();
        setAlert({ text: data.message, type: "error" });
        return;
      }

      setAlert({ text: "توکن بات با موفقیت عوض شد", type: "success" });

      setBot(data.data);
      stopLoading();
    });
  }, []);

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

  const handleUpdateBotToken = useCallback(() => {
    // TODO: handle

    if (!user) return;
    if (!bot) return;
    if (isLoading) return;
    if (!botToken) return;

    startLoading();

    sendEvent("updateBotToken", { userId: user.userId, new_token: botToken });
  }, [user, bot, isLoading, botToken]);

  return (
    <div className="w-full">
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>کاربر گرامی</AlertDialogTitle>
            <AlertDialogDescription>
              <span>
                در صورت عوض کردن بات, برخی از اطلاعات بات قبلی پاک میشود
              </span>
              <span>{"( اطلاعات قابل برگشت نیست )"}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex gap-2">
              <AlertDialogCancel>لغو عملیات</AlertDialogCancel>
              <AlertDialogAction onClick={handleUpdateBotToken}>
                انجام عملیات
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
          onClick={() => setOpenAlert(true)}
        >
          ذخیره کردن
        </Button>
      </div>
    </div>
  );
}
