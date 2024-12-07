"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/authContext";
import { useBot } from "@/contexts/botContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { BotInfoType } from "@/types/bot";
import { useCallback, useEffect, useState } from "react";

export default function GeneralSettings() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [description, setDescription] = useState("");

  const { isLoadingBots, botInfo, setBotInfo, bot } = useBot();
  const { user } = useAuth();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { startLoading, stopLoading, isLoading } = useLoading();

  useEffect(() => {
    if (isLoadingBots) return;
    if (!botInfo) return;

    setName(botInfo.first_name);
    setBio(botInfo.about);
    setDescription(botInfo.description);
  }, [isLoadingBots, botInfo]);

  useEffect(() => {
    receiverEvent("updateBotEventReceiver", (data) => {
      stopLoading();

      if (data.success === false) return;
      if (!data?.result.successful?.length) return;

      // Update botInfo with the successful updates
      const updatedFields = data.result.successful.reduce(
        (acc: any, update: any) => {
          switch (update.field) {
            case "name":
              acc.first_name = update.data?.name || name;
              break;
            case "set_short_description":
              acc.about = update.data?.description || bio;
              break;
            case "description":
              acc.description = update.data?.description || description;
              break;
          }
          return acc;
        },
        {} as Partial<BotInfoType>
      );

      // Update botInfo state
      setBotInfo((prev) => ({ ...prev, ...updatedFields }));
    });
  }, [setBotInfo, name, bio, description]);

  const updated = useCallback(() => {
    if (!user) return;
    if (!name) return;
    if (!bio) return;
    if (!description) return;
    if (!bot) return;

    const data = {};

    const fields_update = [];

    if (name !== botInfo?.first_name) {
      fields_update.push({ field: "name", data: { name } });
    }

    if (bio !== botInfo?.about) {
      fields_update.push({
        field: "set_short_description",
        data: { description: bio },
      });
    }

    if (description !== botInfo?.description) {
      fields_update.push({ field: "description", data: { description } });
    }

    Object.assign(data, {
      userId: user.userId,
      botId: user.botId,
      token: bot.token,
      fields_update,
    });

    startLoading();

    sendEvent("updateBot", data);
  }, [user, name, bio, description, bot, botInfo]);

  return (
    <div className="mt-5 *:mt-3">
      <div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="عنوان ربات"
          className="h-[6.5vh] border-2 border-[#D6D6D6] rounded-lg"
        />
      </div>

      <div>
        <Input
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="بایو ربات"
          className="h-[6.5vh] border-2 border-[#D6D6D6] rounded-lg"
        />
      </div>

      <div>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="توضیحات ربات"
          className="h-[25vh] resize-none border-2 border-[#D6D6D6] rounded-lg"
        />
      </div>

      <div>
        <Button
          disabled={
            isLoadingBots ||
            isLoading ||
            !botInfo ||
            (name === botInfo.first_name &&
              bio === botInfo.about &&
              description === botInfo.description)
          }
          onClick={updated}
        >
          ذخیره کردن
        </Button>
      </div>
    </div>
  );
}
