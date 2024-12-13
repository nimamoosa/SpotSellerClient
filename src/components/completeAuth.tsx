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

// Normalizes the site link to only include the protocol and host
function normalizeSiteLink(link: string): string {
  try {
    const url = new URL(link);
    return `${url.protocol}//${url.host}`;
  } catch (error) {
    return link; // Return the original input if invalid
  }
}

export default function CompleteAuth({
  onSubmit,
}: {
  onSubmit: (
    token: string,
    site: { is_site: boolean; site_link: string; authorization_key: string },
    spot_player_key: string
  ) => void;
}) {
  const [value, setValue] = useState<string>("");
  const [botFatherToken, setBotFatherToken] = useState<string>("");
  const [siteLink, setSiteLink] = useState("");
  const [authorizationKey, setAuthorizationKey] = useState("");
  const [spotPlayerToken, setSpotPlayerToken] = useState<string>("");
  const [courseId, setCourseId] = useState("");
  const [installPlugin, setInstallPlugin] = useState(false);
  const [apisTrue, setApisTrue] = useState(false);

  const { name, setName } = useController();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { alert, setAlert, auth } = useController();

  useEffect(() => {
    receiverEvent("checkPluginInstallEventReceiver", (data) => {
      stopLoading();

      if (data.success === false) {
        const message = JSON.parse(data.message);

        if (message.code === "unauthorized") {
          setAlert({ text: "authorization key اشتباه است", type: "error" });
        } else if (message.code === "rest_no_route") {
          setAlert({
            text: "افزونه SpotSellerAPI روی سایت شما فعال نیست",
            type: "error",
          });
        } else {
          setAlert({ text: "لینک سایت اشتباه است" });
        }
      } else {
        setInstallPlugin(true);
      }
    });
  }, []);

  useEffect(() => {
    if (value === "true" && installPlugin) {
      validSpotPlayerAPItoken();
    }
  }, [installPlugin, value, courseId, spotPlayerToken, auth]);

  useEffect(() => {
    if (!authorizationKey) return;
    if (!siteLink) return;
    if (!spotPlayerToken) return;
    if (!value) return;

    if (value === "true" && apisTrue && installPlugin) {
      onSubmit(
        botFatherToken,
        {
          is_site: value === "true",
          site_link: normalizeSiteLink(siteLink),
          authorization_key: authorizationKey,
        },
        spotPlayerToken
      );
    }
  }, [
    apisTrue,
    botFatherToken,
    siteLink,
    installPlugin,
    authorizationKey,
    spotPlayerToken,
    value,
  ]);

  useEffect(() => {
    if (!spotPlayerToken) return;

    if (apisTrue && !installPlugin) {
      onSubmit(
        botFatherToken,
        {
          is_site: value === "true",
          site_link: "",
          authorization_key: "",
        },
        spotPlayerToken
      );
    }
  }, [apisTrue, installPlugin, authorizationKey, spotPlayerToken]);

  useEffect(() => {
    receiverEvent("testAPIkeyEventReceiver", (data) => {
      stopLoading();

      if (data.success === false) {
        setInstallPlugin(false);
        setAlert({
          text: data.data?.ex?.msg || "یه مشکلی به وجود آمده",
          type: "error",
        });
      } else {
        setApisTrue(true);
      }
    });
  }, []);

  const checkPluginInstall = () => {
    sendEvent("checkPluginInstall", {
      site_url: normalizeSiteLink(siteLink),
      authorization_key: authorizationKey,
    });
  };

  const validSpotPlayerAPItoken = () => {
    sendEvent("testAPIkey", {
      courseId: [courseId],
      API_KEY: spotPlayerToken,
      phone_number: auth,
    });
  };

  return (
    <form
      className="flex flex-col items-center justify-center h-full bg-white"
      onSubmit={(e) => {
        e.preventDefault();
        startLoading();

        if (siteLink && authorizationKey) {
          return checkPluginInstall();
        }

        return validSpotPlayerAPItoken();
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
          <>
            <div
              className={`w-full flex mt-4 mb-4 items-center justify-center`}
            >
              <Input
                dir={siteLink ? "ltr" : "rtl"}
                type="text"
                className="w-[80%] h-[58px] rounded-lg text-[20px] placeholder:text-[#616161] placeholder:text-[18px] border-[#A9A9A9] border-[1px]"
                placeholder={"لینک سایت را وارد کنید"}
                value={siteLink}
                onChange={(e) => setSiteLink(e.target.value)}
                required
              />
            </div>

            <div
              className={`w-full flex mt-4 mb-4 items-center justify-center`}
            >
              <Input
                dir={authorizationKey ? "ltr" : "rtl"}
                type="text"
                className="w-[80%] h-[58px] rounded-lg text-[20px] placeholder:text-[#616161] placeholder:text-[18px] border-[#A9A9A9] border-[1px]"
                placeholder={"authorization key خود را وارد کنید"}
                value={authorizationKey}
                onChange={(e) => setAuthorizationKey(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="w-full flex mt-2 mb-4 items-center justify-center">
          <div className="w-[80%] flex flex-col items-start">
            {/* Autosize Textarea */}
            <AutosizeTextarea
              required
              minLength={11}
              dir={botFatherToken ? "ltr" : "rtl"}
              maxLength={46}
              className="w-full h-[58px] rounded-lg text-[16px] resize-none placeholder:text-[#616161] placeholder:text-[16px] border-[#A9A9A9] border-[1px] mb-2"
              placeholder={"توکن بات فادر"}
              value={botFatherToken}
              onChange={(e) => setBotFatherToken(e.target.value)}
            />

            <AutosizeTextarea
              required
              minLength={11}
              dir={spotPlayerToken ? "ltr" : "rtl"}
              maxLength={46}
              className="w-full h-[58px] rounded-lg text-[16px] resize-none placeholder:text-[#616161] placeholder:text-[16px] border-[#A9A9A9] border-[1px] mb-2"
              placeholder={"API Token اسپات پلیر"}
              value={spotPlayerToken}
              onChange={(e) => setSpotPlayerToken(e.target.value)}
            />

            <AutosizeTextarea
              required
              dir={spotPlayerToken ? "ltr" : "rtl"}
              className="w-full h-[58px] rounded-lg text-[16px] resize-none placeholder:text-[#616161] placeholder:text-[16px] border-[#A9A9A9] border-[1px] mb-2"
              placeholder={"یک شناسه دوره اسپات پلیری وارد کنید"}
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            />

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
