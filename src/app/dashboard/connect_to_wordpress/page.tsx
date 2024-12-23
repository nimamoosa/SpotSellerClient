"use client";

import ToggleButton from "@/components/toggel_button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/authContext";
import { useController } from "@/contexts/controllerContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import normalizeSiteLink from "@/utils/normalizeLink";
import { useCallback, useEffect, useState } from "react";

export default function ConnectToWordpress() {
  const [siteLink, setSiteLink] = useState("");
  const [authorizationKey, setAuthorizationKey] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { isLoading, startLoading, stopLoading } = useLoading();
  const { user, setUser } = useAuth();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { addAlert } = useController();

  useEffect(() => {
    if (!user) return;

    setSiteLink(user.site.site_link);
    setAuthorizationKey(user.site.authorization_key);
  }, [user]);

  useEffect(() => {
    receiverEvent("updateUserClientInformationEventReceiver", (data) => {
      stopLoading();

      if (data.success === false) {
        addAlert("مشکلی در پردازش رخ داده است", "error");
        return;
      }

      addAlert("عملیات با موفقیت ذخیره شد");
      setUser(data.data);
    });

    receiverEvent("checkPluginInstallEventReceiver", (data) => {
      if (!data.success) {
        stopLoading();
        const message = JSON.parse(data.message);

        if (message.code === "unauthorized") {
          addAlert("authorization key اشتباه است", "error");
        } else if (message.code === "rest_no_route") {
          addAlert("افزونه SpotSellerAPI روی سایت شما فعال نیست", "error");
        } else {
          addAlert("لینک سایت اشتباه است", "error");
        }
      } else {
        setIsSuccess(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!isSuccess) return;
    if (!user) return;

    sendEvent("updateUserClientInformation", {
      userId: user.userId,
      site: {
        is_site: true,
        site_link: normalizeSiteLink(siteLink),
        authorization_key: authorizationKey,
      },
    });
  }, [isSuccess, user]);

  const isDisabled = () =>
    (user?.site.site_link === siteLink &&
      user.site.authorization_key === authorizationKey) ||
    authorizationKey == "" ||
    siteLink == "";

  const handleSubmit = useCallback(() => {
    if (!user) return;
    if (!authorizationKey) return;
    if (!siteLink) return;

    startLoading();

    sendEvent("checkPluginInstall", {
      site_url: siteLink,
      authorization_key: authorizationKey,
    });
  }, [user, authorizationKey, siteLink]);

  return (
    <div>
      <div>
        <ToggleButton
          active={user?.site.is_site || false}
          active_text="وصل"
          inactive_text="غیرفعال"
          disabled={false}
          readonly
          loading={false}
          inactive_class="text-[13.5px]"
        />
      </div>

      <div className="mt-10 grid gap-5">
        <div>
          <Input
            disabled={isLoading}
            dir={siteLink ? "ltr" : "rtl"}
            className="w-[90%] h-[50px] rounded-lg text-[20px] placeholder:text-[#616161] placeholder:text-[18px] border-[#A9A9A9] border-[1px]"
            placeholder="لینک سایت"
            value={siteLink}
            onChange={(e) => setSiteLink(e.target.value)}
          />
        </div>

        <div>
          <Input
            disabled={isLoading}
            dir={authorizationKey ? "ltr" : "rtl"}
            className="w-[90%] h-[50px] rounded-lg text-[20px] placeholder:text-[#616161] placeholder:text-[18px] border-[#A9A9A9] border-[1px]"
            placeholder="authorization key"
            value={authorizationKey}
            onChange={(e) => setAuthorizationKey(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-end mt-5 w-[90%]">
        <Button
          variant={"ghost"}
          disabled={isLoading || isDisabled()}
          type="button"
          className="h-[6.5vh] border-2 border-[#D6D6D6] rounded-lg w-[8%]"
          onClick={handleSubmit}
        >
          ذخیره
        </Button>
      </div>
    </div>
  );
}
