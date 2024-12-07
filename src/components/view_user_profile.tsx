"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { useAuth } from "@/contexts/authContext";
import { useBotSupport } from "@/contexts/botSupportContext";
import useLoading from "@/hooks/useLoading";

export default function ViewUserProfile({
  profile,
  open,
  setOpen,
  telegramId,
}: {
  profile: any;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  telegramId: string;
}) {
  const [profileLink, setProfileLink] = useState("");

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { isLoadingSupport, support, setSupport } = useBotSupport();
  const { user } = useAuth();
  const { startLoading, stopLoading, isLoading } = useLoading();

  useEffect(() => {
    receiverEvent("getFileLinkEventReceiver", (data) => {
      if (!data) return;

      setProfileLink(data.data);
    });
  }, []);

  useEffect(() => {
    if (!profile?.photo?.big_file_id) return;
    if (!user) return;

    sendEvent("getFileLink", {
      fileId: profile.photo.big_file_id,
      userId: user.userId,
    });
  }, [profile, user]);

  useEffect(() => {
    receiverEvent("supportEventReceiver", (data) => {
      if (!data.success) return;

      stopLoading();
      setOpen(false);
      setSupport(data.data);
    });
  }, []);

  const handleSendEvent = useCallback(() => {
    if (!user) return;
    if (!telegramId) return;
    if (isLoadingSupport) return;

    startLoading();

    if (!support)
      return sendEvent("createSupport", {
        userId: user.userId,
        botId: user.botId,
        provider: "manual",
        supportId: telegramId,
      });

    return sendEvent("updateSupport", {
      userId: user.userId,
      botId: user.botId,
      provider: "manual",
      supportId: telegramId,
    });
  }, [user, support, isLoadingSupport, telegramId]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[70vh]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="w-full flex items-center justify-center">
            <DrawerTitle>آیا این پروفایل تلگرام شما است؟</DrawerTitle>
          </DrawerHeader>
          <div className="mt-5">
            <div className="flex items-center justify-center">
              {profileLink && (
                <img
                  className="size-52 rounded-lg object-cover"
                  src={profileLink}
                  alt=""
                />
              )}
            </div>

            <div className="p-4 pb-0 flex items-center justify-center -mt-1">
              {profile?.active_usernames?.length
                ? profile?.active_usernames[0]
                : "شما یوزرنیم ندارید"}
            </div>
          </div>
          <DrawerFooter
            className="flex-row items-center justify-center mt-10"
            dir="ltr"
          >
            <Button
              disabled={isLoading || isLoadingSupport}
              onClick={handleSendEvent}
            >
              بله
            </Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                disabled={isLoading || isLoadingSupport}
              >
                خیر
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
