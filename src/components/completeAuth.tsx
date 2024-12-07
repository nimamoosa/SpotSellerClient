"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { AutosizeTextarea } from "./ui/auto-size-textarea";
import { LoadingButton } from "./ui/loading-button";
import useLoading from "@/hooks/useLoading";
import { useController } from "@/contexts/controllerContext";

export default function CompleteAuth({
  onSubmit,
}: {
  onSubmit: (
    token: string,
    site: { is_site: boolean; site_link: string }
  ) => void;
}) {
  const [value, setValue] = useState<string>("");
  const [botFatherToken, setBotFatherToken] = useState<string>("");
  const [siteLink, setSiteLink] = useState("");

  const { name, setName } = useController();
  const { isLoading } = useLoading();

  return (
    <form
      className="flex flex-col items-center justify-center h-full bg-white"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(botFatherToken, {
          is_site: value === "true" ? true : false,
          site_link: siteLink,
        });
      }}
    >
      <div className="text-[28px] text-start w-[80%] font-semibold">
        <p>تکمیل اطلاعات</p>
      </div>

      <div className="w-full">
        <div className={`w-full flex mt-4 mb-4 items-center justify-center`}>
          <Input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-[80%] h-[58px] rounded-lg text-[20px] placeholder:text-[#616161] placeholder:text-[18px] border-[#A9A9A9] border-[1px]"
            placeholder={"نام و نام خانوادگی"}
          />
        </div>

        <div className="w-full flex items-center justify-center">
          <Select required dir="rtl" value={value} onValueChange={setValue}>
            <SelectTrigger className="w-[80%] h-[58px] rounded-lg border-[#A9A9A9] border-[1px]">
              <SelectValue placeholder={"آیا سایت دارید؟"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="true">بله</SelectItem>
                <SelectItem value="false">خیر</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {value === "true" && (
          <div className={`w-full flex mt-4 mb-4 items-center justify-center`}>
            <Input
              type="text"
              className="w-[80%] h-[58px] rounded-lg text-[20px] placeholder:text-[#616161] placeholder:text-[18px] border-[#A9A9A9] border-[1px]"
              placeholder={"لینک سایت را وارد کنید"}
              value={siteLink}
              onChange={(e) => setSiteLink(e.target.value)}
            />
          </div>
        )}

        <div className="w-full flex mt-4 mb-4 items-center justify-center">
          <div className="w-[80%] flex flex-col items-start">
            {/* Autosize Textarea */}
            <AutosizeTextarea
              required
              minLength={11}
              dir={botFatherToken ? "ltr" : "rtl"}
              maxLength={46}
              className="w-full h-[58px] rounded-lg text-[18px] resize-none placeholder:text-[#616161] placeholder:text-[18px] border-[#A9A9A9] border-[1px] mb-2"
              placeholder={"توکن بات فادر"}
              value={botFatherToken}
              onChange={(e) => setBotFatherToken(e.target.value)}
            />

            {/* راهنما Button */}
            <div className="mt-2 self-end w-full flex items-center justify-center">
              <LoadingButton
                dir="ltr"
                className="w-full h-[54px] bg-[#5B0CCA]"
                loading={isLoading}
                type="submit"
              >
                ورود به پنل
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
