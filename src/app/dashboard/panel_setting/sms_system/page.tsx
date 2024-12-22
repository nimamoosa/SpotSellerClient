"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/authContext";
import { useController } from "@/contexts/controllerContext";
import { useSmsService } from "@/contexts/smsServiceContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { FormEvent, useEffect, useState } from "react";

export default function SmsSystem() {
  const [value, setValue] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { addAlert } = useController();
  const { user } = useAuth();
  const { smsService, setSmsService } = useSmsService();

  useEffect(() => {
    if (!smsService) return;

    setValue(smsService.api_key);
  }, [smsService]);

  useEffect(() => {
    receiverEvent("checkAPIkeyEventReceiver", (data) => {
      if (data.data === false) {
        stopLoading();
        addAlert("توکن اشتباه است", "error");
      }

      setIsValidToken(false);
    });
  }, []);

  useEffect(() => {
    if (!smsService) return;

    setOpenAlert(true);
  }, [smsService]);

  useEffect(() => {
    if (!user) return;
    if (!value) return;

    if (isValidToken) {
      sendEvent("createSmsService", {
        userId: user.userId,
        botId: user.botId,
        provider: "kavenegar",
        api_key: value,
      });
    }
  }, [isValidToken, user, value]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startLoading();

    sendEvent("checkAPIkey", { api_key: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <div>
        <Select dir="rtl" value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="سرویس پیامکی خود را انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="kavenegar">کاوه نگار</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-start">
              توجه توجه
            </AlertDialogTitle>
            <AlertDialogDescription className="text-start text-pretty">
              کاربر گرامی باید توجه داشته باشید شما باید یک template جدید به اسم
              code در پنل کاوه نگار خود بسازید,در غیر این صورت ارسال کد کار
              نمیکند
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>باشه</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div>
        <Input
          className="h-[6.5vh] border-2 border-[#D6D6D6] rounded-lg"
          dir={value ? "ltr" : "rtl"}
          placeholder="API کاوه نگار"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="mt-5 w-full flex justify-end items-center">
        <Button
          variant={"ghost"}
          className="h-[6vh] w-[120px] rounded-lg border-2 border-[#D6D6D6]"
          disabled={isLoading}
        >
          ذخیره
        </Button>
      </div>
    </form>
  );
}
