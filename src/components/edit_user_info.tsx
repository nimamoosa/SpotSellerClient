"use client";

import { RegisteredUsersType } from "@/types/registeredUsersType";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { useAuth } from "@/contexts/authContext";
import { useRegisteredUsers } from "@/contexts/registeredUsersContext";
import useLoading from "@/hooks/useLoading";
import { LoadingButton } from "./ui/loading-button";

export default function EditUserInfo({
  userClick,
  setUserClick,
  setIsEdit,
}: {
  userClick: RegisteredUsersType | null;
  setUserClick: Dispatch<SetStateAction<RegisteredUsersType | null>>;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
}) {
  const [values, setValues] = useState<{ phone_number: string; name: string }>({
    phone_number: "",
    name: "",
  });

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { user } = useAuth();
  const { setRegisteredUsers } = useRegisteredUsers();
  const { startLoading, stopLoading, isLoading } = useLoading();

  useEffect(() => {
    receiverEvent("updateUserInformationEventReceiver", (data) => {
      if (data.success == false) return;

      setUserClick(null);
      setRegisteredUsers(data.data.authentications);
      stopLoading();
    });
  }, []);

  useEffect(() => {
    if (!userClick) return;

    setValues({ phone_number: userClick.phone_number, name: userClick.name });
  }, [userClick]);

  const handleSubmit = useCallback(() => {
    if (!userClick) return;
    if (!user) return;

    startLoading();

    sendEvent("updateInformation", {
      userId: userClick.userId,
      botId: user.botId,
      name: values.name,
      phone_number: values.phone_number,
    });
  }, [user, userClick, values]);

  return (
    <Fragment>
      <div className="w-[99%] mb-5 flex items-center justify-end">
        <Button
          className="rounded-lg"
          onClick={() => {
            setIsEdit(false);
            setUserClick(null);
          }}
        >
          بازگشت
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-between">
          <div className="w-[50%] flex items-center justify-center">
            <Input
              className="w-[95%] h-[6.5vh] rounded-lg border-2 border-[#D6D6D6]"
              placeholder={"اسم کاربر"}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              value={values.name}
            />
          </div>

          <div className="w-[50%] flex items-center justify-center">
            <Input
              className="w-[95%] h-[6.5vh] rounded-lg border-2 border-[#D6D6D6]"
              placeholder={"شماره موبایل کاربر"}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*$/.test(value)) {
                  setValues({ ...values, phone_number: value });
                }
              }}
              value={values.phone_number}
              maxLength={11}
            />
          </div>
        </div>

        <div className="w-[98%] mt-2 h-[6vh] flex items-center justify-end">
          <LoadingButton
            variant={"ghost"}
            className="rounded-lg border-2 border-[#D6D6D6]"
            disabled={
              (values.name === userClick?.name &&
                values.phone_number === userClick?.phone_number) ||
              values.name === "" ||
              values.phone_number === "" ||
              values.phone_number.length !== 11
            }
            loading={isLoading}
            onClick={handleSubmit}
            dir="ltr"
          >
            اعمال تغییرات
          </LoadingButton>
        </div>
      </div>
    </Fragment>
  );
}
