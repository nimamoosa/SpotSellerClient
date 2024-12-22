"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AutosizeTextarea } from "./ui/auto-size-textarea";
import { LoadingButton } from "./ui/loading-button";
import useLoading from "@/hooks/useLoading";
import { useController } from "@/contexts/controllerContext";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import normalizeSiteLink from "@/utils/normalizeLink";

export default function CompleteAuth({
  onSubmit,
}: {
  onSubmit: (token: string, spot_player_key: string) => void;
}) {
  const [botFatherToken, setBotFatherToken] = useState<string>("");
  const [spotPlayerToken, setSpotPlayerToken] = useState<string>("");
  const [courseId, setCourseId] = useState("");
  const [installPlugin, setInstallPlugin] = useState(false);
  const [apisTrue, setApisTrue] = useState(false);

  const { name, setName } = useController();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { addAlert, auth } = useController();

  useEffect(() => {
    receiverEvent("testAPIkeyEventReceiver", (data) => {
      stopLoading();

      if (data.success === false) {
        setInstallPlugin(false);
        addAlert(data.data?.ex?.msg || "یه مشکلی به وجود آمده", "error");
      } else {
        setApisTrue(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!apisTrue) return;

    onSubmit(botFatherToken, spotPlayerToken);
    setApisTrue(false);
  }, [apisTrue]);

  const validSpotPlayerAPItoken = () => {
    sendEvent("testAPIkey", {
      courseId: [courseId],
      API_KEY: spotPlayerToken,
      phone_number: auth,
    });
  };

  return (
    <form
      className="flex flex-col w-full items-center justify-center h-full bg-white"
      onSubmit={(e) => {
        e.preventDefault();
        startLoading();

        validSpotPlayerAPItoken();
      }}
    >
      <div className="text-[28px] text-start w-[80%] font-semibold">
        <p>تکمیل اطلاعات</p>
      </div>

      <div className="w-full">
        <div
          className={`w-full flex gap-2 flex-col mt-4 mb-2 items-center justify-center`}
        >
          <div className="w-[80%]">
            <Input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[58px] rounded-lg text-[20px] placeholder:text-[#616161] placeholder:text-[18px] border-[#A9A9A9] border-[1px]"
              placeholder={"نام و نام خانوادگی"}
            />
          </div>

          <div className="w-[80%]">
            <Input
              required
              minLength={11}
              dir={botFatherToken ? "ltr" : "rtl"}
              maxLength={46}
              className="w-full h-[58px] rounded-lg text-[16px] resize-none placeholder:text-[#616161] placeholder:text-[16px] border-[#A9A9A9] border-[1px]"
              placeholder={"توکن بات فادر"}
              value={botFatherToken}
              onChange={(e) => setBotFatherToken(e.target.value)}
            />
          </div>

          <div className="w-[80%]">
            <Input
              required
              minLength={11}
              dir={spotPlayerToken ? "ltr" : "rtl"}
              maxLength={46}
              className="w-full h-[58px] rounded-lg text-[16px] resize-none placeholder:text-[#616161] placeholder:text-[16px] border-[#A9A9A9] border-[1px]"
              placeholder={"API Token اسپات پلیر"}
              value={spotPlayerToken}
              onChange={(e) => setSpotPlayerToken(e.target.value)}
            />
          </div>

          <div className="w-[80%]">
            <Input
              required
              dir={courseId ? "ltr" : "rtl"}
              className="w-full h-[58px] rounded-lg text-[16px] resize-none placeholder:text-[#616161] placeholder:text-[16px] border-[#A9A9A9] border-[1px]"
              placeholder={"یک شناسه دوره اسپات پلیری وارد کنید"}
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 self-end w-full flex items-center justify-center">
          <LoadingButton
            dir="ltr"
            className="w-[80%] h-[54px] bg-[#5B0CCA]"
            loading={isLoading}
            type="submit"
          >
            ورود به پنل
          </LoadingButton>
        </div>
      </div>
    </form>
  );
}
