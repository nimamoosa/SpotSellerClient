"use client";

import { useController } from "@/contexts/controllerContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LoadingButton } from "./ui/loading-button";

export default function Auth({ onClick }: { onClick: () => void }) {
  const { auth, setAuth, isLoading } = useController();

  return (
    <form
      className="w-full h-full flex flex-col items-center justify-center"
      onSubmit={(e) => {
        e.preventDefault();

        onClick();
      }}
    >
      <div className="flex justify-center w-full">
        <div className="w-[80%] mb-5 font-semibold text-[28px]">
          <p>ورود یا عضویت</p>
        </div>
      </div>

      <div className="w-full flex items-center justify-center">
        <Input
          className="w-[80%] h-[58px] rounded-lg border-[#A9A9A9] border-[1px]"
          placeholder="شماره موبایل خود را وارد کنید"
          value={auth}
          onChange={(e) => setAuth(e.target.value)}
          maxLength={11}
          dir={auth ? "ltr" : "rtl"}
        />
      </div>

      <div className="w-full flex justify-center mt-5">
        <LoadingButton
          dir="ltr"
          className="w-[80%] rounded-lg h-[58px] text-[18px]"
          disabled={!auth || auth.length !== 11}
          loading={isLoading}
          type="submit"
        >
          ارسال کد تایید
        </LoadingButton>
      </div>
    </form>
  );
}
