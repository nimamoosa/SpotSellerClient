"use client";

import { ChartColumn, Pen, Plus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useCourse } from "@/contexts/courseContext";
import { useEffect, useState } from "react";
import { CourseType } from "@/types/course";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { useAuth } from "@/contexts/authContext";
import { useController } from "@/contexts/controllerContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { BsBucket } from "react-icons/bs";
import { Spinner } from "./ui/spinner";
import { useSearchParams } from "next/navigation";

export default function ShowCourse({
  addCourse,
  editCourse,
  saleState,
}: {
  addCourse?: () => void;
  editCourse?: (course: CourseType) => void;
  saleState?: (course: CourseType) => void;
}) {
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    text: string;
  }>({ type: "error", text: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [item, setItem] = useState<{ _id: string } | null>(null);
  const [availableCourses, setAvailableCourses] = useState<CourseType[]>([]);
  const [courseId, setCourseId] = useState("");

  const {
    courses,
    addCourse: addNewCourse,
    deleteCourse,
    isLoadingCourse,
  } = useCourse();
  const { user } = useAuth();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { addAlert } = useController();
  const searchParams = useSearchParams();

  useEffect(() => {
    receiverEvent("deleteCourseEventReceiver", (data) => {
      if (!data.success) return setAlert({ type: "error", text: data.message });

      deleteCourse(data.id);
      setAlert({ type: "success", text: "دوره با موفقیت پاک شد" });
      stopLoading();
    });
  }, []);

  useEffect(() => {
    if (!alert.text) return;

    addAlert(alert.text, alert.type);
  }, [alert]);

  useEffect(() => {
    if (!courses) return;

    setAvailableCourses(courses);
  }, [courses]);

  useEffect(() => {
    const Id = searchParams.get("id");

    if (!Id || !courses) return;

    setCourseId(
      courses.find((item) => item.id.trim() === Id.trim())?.title || ""
    );
  }, [searchParams, courses]);

  useEffect(() => {
    if (!courseId) return;

    setAvailableCourses((prev) =>
      prev.filter((course) =>
        course.title.toLowerCase().includes(courseId.trim().toLowerCase())
      )
    );
  }, [courseId]);

  return (
    <div className="w-full h-full">
      <header className="flex justify-between items-center">
        <div className="w-[50%]">
          <div>
            <Button
              variant={"ghost"}
              className="w-[22%] h-[45px] text-[16px] rounded-[10px] border-2 border-[#D6D6D6]"
              onClick={addCourse}
            >
              <Plus /> افزودن دوره
            </Button>
          </div>
        </div>

        <div className="w-[50%] flex items-center justify-end">
          <div className="ml-3">
            <Input
              className="h-[48px] border-2 rounded-[10px] border-[#D6D6D6]"
              placeholder="جستجو..."
              value={courseId || ""}
              onChange={({ target: { value } }) => {
                if (!value) return setAvailableCourses(courses);

                setAvailableCourses((prev) =>
                  prev.filter((course) =>
                    course.title
                      .toLowerCase()
                      .includes(value.trim().toLowerCase())
                  )
                );

                setCourseId(value);
              }}
            />
          </div>

          <div className="flex items-center justify-end">
            <Button className="size-12 rounded-[10px]">
              <Search />
            </Button>
          </div>
        </div>
      </header>

      <main className="mt-7 w-full overflow-auto h-[67vh]">
        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-start">
                توجه توجه
              </AlertDialogTitle>
              <AlertDialogDescription className="text-start">
                آیا موافق انجام این عملیات هستید؟
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel>خیر</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  startLoading();

                  sendEvent("deleteCourse", {
                    botId: user?.botId,
                    userId: user?.userId,
                    _id: item?._id,
                  });
                }}
              >
                بله
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
              {isLoadingCourse ? (
                <div>
                  <Spinner>لطفا کمی صبر کنید....</Spinner>
                </div>
              ) : (
                availableCourses?.map((item, index) => {
                  return (
                    <TableRow className="hover:bg-transparent" key={index}>
                      <TableCell className="font-medium border-l-[1px] text-[16px] border-l-[#C6C6C6]">
                        <p className="mr-5">{item.title}</p>
                      </TableCell>
                      <TableCell className="flex justify-between gap-5">
                        <div className="-ml-2">
                          <Button
                            className="bg-[#66BB00]/10 text-[#519506] rounded-full hover:bg-[#66BB00]/20"
                            disabled={isLoading}
                            onClick={() => editCourse && editCourse(item)}
                          >
                            <Pen /> ویرایش
                          </Button>
                        </div>

                        <div>
                          <Button
                            className="bg-[#BE6D05]/10 text-[#BE6D05] rounded-full hover:bg-[#BE6D05]/20"
                            disabled={isLoading}
                            onClick={() => saleState && saleState(item)}
                          >
                            <ChartColumn /> وضعیت فروش
                          </Button>
                        </div>

                        <div className="-mr-2">
                          <Button
                            className="bg-red-700/90 text-white hover:bg-red-700/80 rounded-full"
                            disabled={isLoading}
                            onClick={() => {
                              setOpenDialog(true);
                              setItem({ _id: item.id });
                            }}
                          >
                            <BsBucket /> حذف دوره
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
