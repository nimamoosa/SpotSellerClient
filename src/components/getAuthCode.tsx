import { useController } from "@/contexts/controllerContext";
import { Button } from "./ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";
import { LoadingButton } from "./ui/loading-button";

export default function GetAuthCode({ onClick }: { onClick: () => void }) {
  const { code, setCode, isLoading } = useController();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white">
      <div className="flex justify-center w-full">
        <div className="w-[80%] mb-5 font-semibold text-[28px]">
          <p>کد ورود ارسال شد</p>
        </div>
      </div>

      <div className="w-full flex items-center justify-center" dir="ltr">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(value) => setCode(value)}
          className="border-black border-2"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="w-full flex justify-center mt-5">
        <LoadingButton
          dir="ltr"
          className="w-[80%] rounded-lg h-[58px] text-[18px]"
          onClick={onClick}
          disabled={!code || code.length !== 6}
          loading={isLoading}
        >
          تایید
        </LoadingButton>
      </div>
    </div>
  );
}
