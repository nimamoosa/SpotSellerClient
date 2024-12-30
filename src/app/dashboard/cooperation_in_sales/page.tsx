"use client";

import ToggleButton from "@/components/toggel_button";
import { Toggle } from "@/components/ui/toggle";
import { useCooperationSales } from "@/contexts/cooperationSaleContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";

export default function CooperationInSales() {
  const { cooperationSalesClient, isLoadingCooperationSalesClient } =
    useCooperationSales();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { sendEvent, receiverEvent } = useSocketRequest();

  return (
    <div>
      <header className="flex items-center gap-5">
        <ToggleButton
          active={cooperationSalesClient !== null}
          active_text="فعال"
          inactive_text="غیر فعال"
          inactive_class="text-[12px]"
          loading={isLoadingCooperationSalesClient || isLoading}
          disabled={isLoadingCooperationSalesClient || isLoading}
        />

        <Toggle
          pressed={cooperationSalesClient?.type === "for_all_user" || false}
          className="rounded-xl"
          disabled={cooperationSalesClient === null || isLoading}
        >
          {cooperationSalesClient?.type === "for_all_user"
            ? "برای همه ی کاربران"
            : "برای کاربر خاص"}
        </Toggle>
      </header>
    </div>
  );
}
