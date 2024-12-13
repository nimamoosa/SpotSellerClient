"use client";

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
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { FormEvent, useEffect, useState } from "react";

export default function SmsSystem() {
  const [value, setValue] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { setAlert } = useController();
  const { user } = useAuth();

  useEffect(() => {
    receiverEvent("checkAPIkeyEventReceiver", (data) => {
      if (data.data === false) {
        stopLoading();
        setAlert({ text: "توکن اشتباه است", type: "error" });
      }

      setIsValidToken(false);
    });
  }, []);

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

      <div>
        <Input
          className="h-[6.5vh] border-2 border-[#D6D6D6] rounded-lg"
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
