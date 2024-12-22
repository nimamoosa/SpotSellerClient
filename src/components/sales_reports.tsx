"use client";

import { CourseType } from "@/types/course";
import { Button } from "./ui/button";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

export default function SalesReports({
  course,
  back,
}: {
  course: CourseType | undefined;
  back?: () => void;
}) {
  const [open, setOpen] = useState<{ show: boolean; type: string }>({
    show: false,
    type: "",
  });

  const conversion = useCallback(() => {
    if (!course) return;

    const finished = course.sales_reports.sale / course.sales_reports.canceled;
    const percent = finished * 100;

    return Math.ceil(percent) || 0;
  }, [course]);

  return (
    <Fragment>
      <Drawer
        open={open.show}
        onOpenChange={(changed) => setOpen({ show: changed, type: open.type })}
      >
        <DrawerContent className="h-[70vh]">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>
                Set your daily activity goal.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                >
                  <Minus />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-7xl font-bold tracking-tighter">
                    {10}
                  </div>
                  <div className="text-[0.70rem] uppercase text-muted-foreground">
                    Calories/day
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                >
                  <Plus />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
              <div className="mt-3 h-[120px]">
                <p>hi</p>
              </div>
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <div
        className="w-[95%] mr-auto ml-auto flex items-center justify-end mb-4"
        onClick={back}
      >
        <Button>بازگشت</Button>
      </div>

      <div className="w-[95%] h-[285px] flex ml-auto mr-auto rounded-lg border-[#C7C7C7] border-[1px]">
        <div className="w-[30%] h-full border-l-[1px] flex flex-col justify-center items-center *:w-[70%]">
          <div className="font-bold text-[100px] text-[#818181] -mb-5">
            <p>{course?.sales_reports.sale}</p>
          </div>

          <div className="text-[24px] font-bold text-start">
            <p>فروش</p>
          </div>

          <div className="mt-3">
            <button className="text-[#5B0CCA] flex text-[18px]">
              لیست سفارشات <ArrowLeft className="mr-2" />
            </button>
          </div>
        </div>

        <div className="w-[70%] h-full flex">
          <div className="w-[55%] h-full flex flex-col justify-center items-center *:w-[70%]">
            <div className="font-bold text-[100px] text-[#818181] -mb-5">
              <p>{course?.sales_reports.canceled}</p>
            </div>

            <div className="text-[24px] font-bold">
              <p>لغو شده</p>
            </div>

            <div className="mt-3">
              <button className="text-[#5B0CCA] flex text-[18px]">
                لیست لفو شده ها <ArrowLeft className="mr-2" />
              </button>
            </div>
          </div>

          <div className="w-[45%] h-full p-3">
            <div className="w-full h-full text-center rounded-lg bg-[#EE8800]/10">
              <div className="text-[24px] h-[12vh] flex items-end justify-center">
                <p className="font-bold">درصد تبدیل شما</p>
              </div>

              <div className="flex flex-col h-[23vh] items-center justify-start">
                <div className="text-[100px]">
                  <p>{conversion()}</p>
                </div>

                <div className="text-[24px] -mt-9 text-[#818181]">
                  <p>بوده است</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
