"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/authContext";
import { useController } from "@/contexts/controllerContext";
import { useCooperationSales } from "@/contexts/cooperationSaleContext";
import { useCourse } from "@/contexts/courseContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { AvailableCourses } from "@/types/cooperationSaleType";
import { useEffect, useState } from "react";

export default function ActiveCourse() {
  const [availableCourses, setAvailableCourses] = useState<AvailableCourses[]>(
    []
  );

  const {
    cooperationSalesClient,
    setCooperationSalesClient,
    isLoadingCooperationSalesClient,
  } = useCooperationSales();
  const { courses } = useCourse();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { user } = useAuth();
  const { addAlert } = useController();

  useEffect(() => {
    receiverEvent("updateCooperationFiledEventReceiver", (data) => {
      stopLoading();

      if (!data.success) return;

      setCooperationSalesClient(data.update);
    });
  }, []);

  useEffect(() => {
    if (!cooperationSalesClient) return;

    setAvailableCourses(cooperationSalesClient.available_courses);
  }, [cooperationSalesClient]);

  const handleUpdateCourseStatus = (deleted: boolean, courseId: string) => {
    startLoading();

    sendEvent("updateCooperationFiled", {
      userId: user?.userId,
      botId: user?.botId,
      update_filed: [
        {
          method: deleted ? "course_delete" : "course_add", // course_delete or course_add
          field: {
            courseId,
          },
        },
      ],
    });
  };

  const handleClickSave = () => {
    startLoading();

    sendEvent("updateCooperationFiled", {
      userId: user?.userId,
      botId: user?.botId,
      update_filed: [
        {
          method: "update_all_courses", // course_delete or course_add
          field: {
            available_courses: availableCourses,
          },
        },
      ],
    });
  };

  const isDisabled = () => {
    if (!cooperationSalesClient || isLoading) return true;

    const areSharesEqual = availableCourses.every((course) => {
      const matchingCourse = cooperationSalesClient?.available_courses.find(
        (clientCourse) => clientCourse.courseId === course.courseId
      );

      return matchingCourse?.share === course.share;
    });

    return areSharesEqual;
  };

  return (
    <main className="overflow-auto h-full">
      <div className="h-[50vh] overflow-auto">
        <div className="border border-[#D6D6D6] rounded-xl overflow-hidden">
          <Table className="w-full border-collapse">
            <TableHeader className="w-full">
              <TableRow className="font-medium text-[16px] bg-[#F6F6F6] border-b border-gray-300">
                <TableHead className="w-[70%] border-l-[1px] p-4 border-l-[#C6C6C6] rounded-tr-lg bg-[#F6F6F6] text-start">
                  <p className="mr-3 w-fit">عنوان دوره</p>
                </TableHead>
                <TableHead className="w-[30%] rounded-tl-lg bg-[#F6F6F6] text-center">
                  <p>عملیات</p>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableCourses && courses ? (
                courses.map((item, index) => {
                  return (
                    <TableRow className="hover:bg-transparent" key={index}>
                      <TableCell className="font-medium border-l-[1px] text-[16px] border-l-[#C6C6C6]">
                        <p className="mr-5">{item.title}</p>
                      </TableCell>
                      <TableCell className="flex justify-evenly items-center">
                        <div className="-ml-2">
                          <Button
                            className="bg-[#66BB00]/10 text-[#519506] rounded-full hover:bg-[#66BB00]/20"
                            disabled={isLoading || !cooperationSalesClient}
                            onClick={() =>
                              handleUpdateCourseStatus(
                                availableCourses.some(
                                  (cooperation) =>
                                    cooperation.courseId === item._id
                                ),
                                item._id
                              )
                            }
                          >
                            {availableCourses.find(
                              (cooperation) => cooperation.courseId === item._id
                            )
                              ? "غیر فعال"
                              : "فعال"}
                          </Button>
                        </div>

                        <div className="-ml-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                className="bg-[#66BB00]/10 text-[#519506] rounded-full hover:bg-[#66BB00]/20"
                                disabled={isLoading || !cooperationSalesClient}
                              >
                                درصد سهم
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[150px]">
                              <div>
                                <Slider
                                  defaultValue={[
                                    availableCourses.find(
                                      (cooperation) =>
                                        cooperation.courseId === item._id
                                    )?.share || 0,
                                  ]}
                                  max={100}
                                  step={1}
                                  value={[
                                    availableCourses.find(
                                      (cooperation) =>
                                        cooperation.courseId === item._id
                                    )?.share || 0,
                                  ]}
                                  onValueChange={(val) => {
                                    setAvailableCourses((prev) => {
                                      if (!prev) return [];

                                      const updatedCourses = prev.map(
                                        (course) => {
                                          if (course.courseId === item._id) {
                                            return {
                                              ...course,
                                              share: val[0] || 0,
                                            };
                                          }
                                          return course;
                                        }
                                      );

                                      return updatedCourses;
                                    });
                                  }}
                                />
                              </div>

                              <DropdownMenuSeparator />

                              <div className="flex items-center justify-center mt-5">
                                <p>
                                  %{" "}
                                  {availableCourses.find(
                                    (cooperation) =>
                                      cooperation.courseId === item._id
                                  )?.share || 0}{" "}
                                </p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-10">
        <Button
          variant={"ghost"}
          className="border-2 rounded-lg h-[6vh]"
          disabled={isDisabled()}
          onClick={handleClickSave}
        >
          ذخیره تغییرات
        </Button>
      </div>
    </main>
  );
}
