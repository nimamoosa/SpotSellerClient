"use client";

import ToggleButton from "@/components/toggel_button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/authContext";
import { useController } from "@/contexts/controllerContext";
import { usePayment } from "@/contexts/paymentContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { useCallback, useEffect, useState } from "react";

export default function FinanceSettings() {
  const [values, setValues] = useState<{
    cart_by_cart?: string;
    zarinpal?: string;
  } | null>(null);

  const { isLoadingPayment, setPayment, payment } = usePayment();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { setAlert } = useController();
  const { user } = useAuth();
  const { isLoading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    receiverEvent("createClientPaymentEventReceiver", (data) => {
      data?.success_message &&
        setAlert({ text: data.success_message, type: "success" });

      setPayment(data.data);
      stopLoading();
    });
  }, []);

  useEffect(() => {
    if (isLoadingPayment) return;
    if (!payment) return;

    setValues({
      cart_by_cart:
        payment.payments.find((item) => item.type === "cart_by_cart")?.field ||
        "",
      zarinpal:
        payment.payments.find((item) => item.type === "zarinpal")?.field || "",
    });
  }, [payment, isLoadingPayment]);

  const handleSave = useCallback(() => {
    if (!user) return;

    if (
      !values ||
      (values.cart_by_cart === undefined && values.zarinpal === undefined)
    ) {
      return setAlert({
        text: "شما باید حداقل یک فیلد را پر کنید",
        type: "error",
      });
    }

    startLoading();

    const paymentData = Object.entries(values)
      .filter(([key, value]) => value !== null && value !== undefined)
      .map(([key, value]) => ({ type: key, field: value, date: Date.now() }));

    const paymentMethods = Object.keys(values).filter(
      (key) =>
        values[key as keyof typeof values] !== null &&
        values[key as keyof typeof values] !== undefined
    );

    sendEvent("createClientPayment", {
      userId: user.userId,
      botId: user.botId,
      payment_methods: paymentMethods, // Array of non-null methods
      payments: paymentData,
    });
  }, [user, values]);

  const checkFields = () => {
    const isCartByCartValid =
      values?.cart_by_cart ===
        payment?.payments.find((item) => item.type === "cart_by_cart")?.field ||
      values?.cart_by_cart === "";

    const isZarinpalValid =
      values?.zarinpal ===
        payment?.payments.find((item) => item.type === "zarinpal")?.field ||
      values?.zarinpal === "";

    // Return true if both are valid (either empty or equal), false otherwise
    return isCartByCartValid && isZarinpalValid;
  };

  return isLoadingPayment ? (
    <div className="flex items-center justify-center w-full h-full">
      <Spinner>درحال بارگذاری</Spinner>
    </div>
  ) : (
    <div className="mt-4 w-full">
      <section className="w-full">
        <div className="flex gap-4">
          <div>
            <ToggleButton
              readonly
              active={payment?.payment_methods.includes("zarinpal") || false}
              loading={false}
              disabled={isLoading}
              onClick={() => {}}
              inactive_class="text-[13px]"
              active_class="text-[16px]"
              active_text="فعال"
              inactive_text="غیرفعال"
            />
          </div>
          <div>
            <p>پرداخت از طریق درگاه بانکی</p>
          </div>
        </div>

        <div className="mt-5">
          <Input
            dir={values?.zarinpal ? "ltr" : "rtl"}
            className="h-[6.5vh] border-2 border-[#D6D6D6] rounded-lg w-[95%]"
            placeholder="مرچنت زرین پال خود را وارد کنید"
            value={values?.zarinpal || ""}
            onChange={(e) =>
              setValues({
                zarinpal: e.target.value,
                cart_by_cart: values?.cart_by_cart,
              })
            }
          />
        </div>
      </section>

      <section className="w-full mt-10">
        <div className="flex gap-4">
          <div>
            <ToggleButton
              readonly
              active={
                payment?.payment_methods.includes("cart_by_cart") || false
              }
              loading={false}
              disabled={isLoading}
              onClick={() => {}}
              active_class="text-[14px]"
              inactive_class="text-[13px]"
              active_text="فعال"
              inactive_text="غیرفعال"
            />
          </div>
          <div>
            <p>پرداخت از طریق کارت به کارت</p>
          </div>
        </div>

        <div className="mt-5">
          <Input
            dir={values?.cart_by_cart ? "ltr" : "rtl"}
            className="h-[6.5vh] border-2 border-[#D6D6D6] rounded-lg w-[95%]"
            placeholder="شماره کارت خود را وارد کنید"
            value={values?.cart_by_cart || ""}
            onChange={(e) =>
              setValues({
                zarinpal: values?.zarinpal,
                cart_by_cart: e.target.value,
              })
            }
          />
        </div>
      </section>

      <section className="flex items-center justify-end w-[95%]">
        <Button
          variant={"ghost"}
          type="button"
          className="h-[6.5vh] border-2 border-[#D6D6D6] mt-5 rounded-lg w-[8%]"
          onClick={handleSave}
          disabled={isLoading || checkFields()}
        >
          ذخیره
        </Button>
      </section>
    </div>
  );
}
