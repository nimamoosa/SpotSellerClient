"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { useController } from "@/contexts/controllerContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ManualSupport() {
  const { addLink, removeLink } = useController();
  const router = useRouter();

  const isSetLink = useRef(false);

  // useEffect(() => {
  //   if (isSetLink.current) return;

  //   isSetLink.current = true;

  //   addLink("پشتیبانی هوش مصنوعی", "support");
  // }, [isSetLink]);

  return (
    <div className="flex gap-3 flex-col items-center h-[85%] justify-center">
      <div className="flex items-center justify-end w-[89%]">
        <Button
          onClick={() => {
            router.back();
            removeLink("support");
          }}
        >
          بازگشت
        </Button>
      </div>

      <div className="w-full flex flex-col h-full items-center justify-center gap-5 text-[60px] text-[#9E9E9E]">
        <div className="-mb-5">
          <p className="text-[70px]">AI</p>
        </div>
        <div className="flex flex-col">
          <span className="whitespace-break-spaces">پشتیبانی هوش مصنوعنی</span>
          <span>به زودی اضافه خواهد شد</span>
        </div>
      </div>
    </div>
  );
}
