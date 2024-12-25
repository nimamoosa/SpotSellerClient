"use client";

import { CourseType } from "@/types/course";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import useLoading from "@/hooks/useLoading";
import { useAuth } from "@/contexts/authContext";
import { useCourse } from "@/contexts/courseContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { randomBytes } from "crypto";
import { BsShop } from "react-icons/bs";
import AmountInput from "./amount_input";
import { useFile } from "@/contexts/fileContext";
import { useController } from "@/contexts/controllerContext";
import { Skeleton } from "./ui/skeleton";

export default function EditCourse({
  course,
  backClick,
}: {
  course: CourseType | undefined;
  backClick: () => void;
}) {
  const [values, setValues] = useState<{
    title: string;
    course_id: string;
    description: string;
    amount: number;
  }>({
    title: "",
    course_id: "",
    description: "",
    amount: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [parameters, setParameters] = useState(false);
  const [error, setError] = useState("");

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { addArrayCourse, courses } = useCourse();
  const { user } = useAuth();
  const { fileUrls, removeFile, addFile } = useFile();
  const { addAlert } = useController();

  useEffect(() => {
    receiverEvent("editCourseEventReceiver", (data) => {
      addArrayCourse(data.updatedCourse.courses);

      stopLoading();
      backClick();
    });
  }, []);

  useEffect(() => {
    if (course === undefined) return;
    if (parameters) return;

    setValues({
      course_id: course.courseId,
      description: course.description,
      title: course.title,
      amount: course.amount,
    });
    setDiscountCode(course.discount.code);
    setDiscountAmount(course.discount.amount);
    setParameters(true);
  }, [course, discountCode, parameters]);

  useEffect(() => {
    if (!fileUrls?.length) return;
    if (!course) return;

    setPreview(
      fileUrls.find((file) => file.controllerId === course._id)?.file || ""
    );
  }, [fileUrls, course]);

  useEffect(() => {
    receiverEvent("uploadFileEventReceiver", (data) => {
      if (data.success === false) return;

      if (data.progress) {
        setProgress(data.progress);
        return;
      }

      if (!data.downloadLink) return;

      setProgress(0);

      setDownloadLink(data.downloadLink);
    });
  }, []);

  useEffect(() => {
    receiverEvent("deleteFileEventReceiver", (data) => {
      if (data.success === false) return setError(data.message);

      removeFile(data._id);
      setIsUploaded(true);
    });
  }, []);

  useEffect(() => {
    if (!error) return;

    addAlert(error, "error");
  }, [error]);

  useEffect(() => {
    if (!isUploaded) return;
    if (!user) return;
    if (!selectedFile) return;

    console.log("upload file");

    uploadFile(selectedFile, user.name, user.userId, user.botId);
  }, [isUploaded, user, selectedFile]);

  useEffect(() => {
    if (!downloadLink) return;
    if (!user) return;
    if (!values) return;
    if (!course) return;

    const updatedCourseData = {};

    Object.assign(updatedCourseData, {
      title: values.title,
      description: values.description,
      courseId: values.course_id,
      amount: values.amount,
      media_url: downloadLink,
      discount: {
        code: discountCode,
        amount: discountAmount,
      },
    });

    sendEvent("editCourse", {
      userId: user.userId,
      _id: course._id,
      updatedCourseData,
    });

    setDownloadLink("");
  }, [downloadLink, user, values, course, discountAmount, discountCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 20 * 1024 * 1024)
      return addAlert(
        "شما بیشتر از 20 مگ نمیتوانید عکسی آپلود کنید",
        "warning"
      );

    if (!["image/png", "image/jpg", "image/jpeg"].includes(file?.type))
      return addAlert("نوع فایل صحیح نمی باشد", "error");

    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadFile = (
    file: File | null | undefined,
    name: string | undefined,
    userId: number | undefined,
    botId: number | undefined
  ) => {
    if (!file) return;

    const chunkSize = 32 * 1024; // 1 MB per chunk (adjust as necessary)
    const totalChunks = Math.ceil(file.size / chunkSize);

    let chunkIndex = 0;

    // Read and send file chunks sequentially
    const sendChunk = () => {
      const reader = new FileReader();
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);

      const chunk = file.slice(start, end);

      // Return a promise that resolves once the chunk is sent
      return new Promise<void>((resolve, reject) => {
        reader.onloadend = () => {
          const data = {
            chunk: reader.result,
            chunkIndex,
            totalChunks,
            filename: file.name,
            userId,
            botId,
            type: "profile",
            name,
            another_data: values,
          };

          // Send the chunk to the server via Socket.IO
          sendEvent("uploadFile", data);

          // If there are more chunks, resolve to send the next one
          if (chunkIndex + 1 < totalChunks) {
            chunkIndex++;
            resolve(); // Continue to the next chunk
          } else {
            // setUploadMessage("File upload complete!");
            resolve(); // End the process when the last chunk is sent
          }
        };

        reader.onerror = (error) => reject(error); // Handle reading errors

        // Read the current chunk as a data URL (Base64)
        reader.readAsDataURL(chunk);
      });
    };

    // Function to start uploading chunks sequentially
    const uploadChunksSequentially = async () => {
      for (let i = chunkIndex; i < totalChunks; i++) {
        await sendChunk(); // Wait for each chunk to finish before sending the next
      }
    };

    // setUploading(true);
    uploadChunksSequentially(); // Start sending the file chunks sequentially
  };

  const noChangeCourse = () => {
    const { course_id, description, title, amount } = values;

    return (
      course_id === course?.courseId &&
      description === course?.description &&
      title === course?.title &&
      fileUrls.some((item) => item.file === preview) &&
      amount === course.amount &&
      discountCode == course.discount?.code &&
      discountAmount === course.discount.amount
    );
  };

  const handleSubmit = useCallback(() => {
    const updatedCourseData = {};

    if (!user) return;
    if (!values) return;
    if (!course) return;

    Object.assign(updatedCourseData, {
      title: values.title,
      description: values.description,
      courseId: values.course_id,
      media_url: course.media_url,
      amount: values.amount,
      discount: {
        code: discountCode,
        amount: discountAmount,
      },
    });

    sendEvent("editCourse", {
      userId: user.userId,
      _id: course._id,
      updatedCourseData,
    });
  }, [user, values, course, discountCode, discountAmount]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        startLoading();

        if (selectedFile) {
          return sendEvent("deleteFile", {
            downloadLink: course?.media_url,
            _id: course?._id,
          });
        }

        return handleSubmit();
      }}
    >
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-start">
              {alertType === "preview_image"
                ? "پیش نمایش عکس"
                : "ساخت کد تخفیف"}
            </AlertDialogTitle>
            <div className="w-full" suppressHydrationWarning>
              {alertType === "preview_image" ? (
                <img className="w-full rounded-lg" src={preview} alt="" />
              ) : (
                <div>
                  <div className="flex flex-col gap-5">
                    <Input
                      className="w-full h-[62px] rounded-[10px] border-[#D6D6D6] border-2"
                      maxLength={30}
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="کد تخفیف مد نظر خود را وارد کنید"
                    />

                    <AmountInput
                      value={discountAmount !== 0 ? String(discountAmount) : ""}
                      onChange={(value) => setDiscountAmount(Number(value))}
                      placeholder="مبلغ کد تخفیف را وارد کنید"
                    />
                  </div>
                </div>
              )}
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <div
              className={`w-[35%] flex flex-col items-end ${
                alertType !== "preview_image"
                  ? "bg-black/30 p-2 shadow-2xl"
                  : "bg-transparent"
              } rounded-lg`}
            >
              {alertType !== "preview_image" && (
                <div className="w-full flex items-center justify-center mb-2">
                  <Button
                    variant={"secondary"}
                    onClick={() =>
                      setDiscountCode(
                        randomBytes(30).toString("hex").slice(0, 30)
                      )
                    }
                    className="w-full"
                  >
                    ساخت کد تخفیف
                  </Button>
                </div>
              )}

              <div
                className={`flex ${
                  alertType !== "preview_image"
                    ? "justify-between"
                    : "justify-end"
                } w-full`}
              >
                <AlertDialogCancel
                  className="w-[45%]"
                  onClick={() => {
                    if (alertType !== "preview_image") {
                      setDiscountAmount(0);
                      setDiscountCode("");
                    }
                  }}
                >
                  بستن
                </AlertDialogCancel>

                {alertType !== "preview_image" && (
                  <>
                    <AlertDialogAction
                      className="w-[45%]"
                      disabled={discountAmount === 0 || discountCode === ""}
                    >
                      افزودن
                    </AlertDialogAction>
                  </>
                )}
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <section className="w-full">
        <header className="flex items-center justify-center">
          <div className="w-[50%] flex items-center justify-start">
            <div className="ml-5">
              {preview ? (
                <img
                  src={preview}
                  alt="course_photo"
                  className="rounded-lg object-cover cursor-pointer w-[100px] h-[55px]"
                  onClick={() => {
                    setAlertType("preview_image");
                    setOpenAlert(true);
                  }}
                />
              ) : (
                <Skeleton className="w-[100px] h-[55px] bg-black/20" />
              )}
            </div>

            <div className="">
              <Button
                className="bg-[#BE6D05]/10 rounded-[46px] w-full h-[40px] text-[#BE6D05] text-[17px]"
                onClick={() => document.getElementById("choose_file")?.click()}
                type="button"
                disabled={isLoading || !preview}
              >
                {preview ? "انتخاب فایل" : "درحال بارگذاری عکس ..."}
              </Button>
              <Input
                type="file"
                id="choose_file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="w-[50%] flex items-center justify-end">
            <Button
              className="rounded-lg w-[120px]"
              type="button"
              onClick={backClick}
              disabled={isLoading || courses?.length === 0}
            >
              بازگشت
            </Button>
          </div>
        </header>
      </section>

      <section className="mt-2">
        <div className="flex mb-2">
          <div className="w-[50%] flex items-center justify-start">
            <Input
              placeholder="عنوان دوره"
              className="w-[99%] h-[62px] rounded-[10px] border-[#D6D6D6] border-2"
              name="title"
              onChange={handleChange}
              value={values.title}
              required
            />
          </div>

          <div className="w-[50%] flex items-center justify-end">
            <Input
              placeholder="شناسه دوره را وارد کنید"
              className="w-[99%] h-[62px] rounded-[10px] border-[#D6D6D6] border-2"
              name="course_id"
              onChange={handleChange}
              value={values.course_id}
              required
            />
          </div>
        </div>

        <div className="mb-2">
          <AmountInput
            onChange={(v) => {
              setValues({ ...values, amount: Number(v) });
            }}
            value={String(values.amount)}
          />
        </div>

        <div className="flex items-center justify-center">
          <Textarea
            className="w-[1146px] h-[292px] border-[#D6D6D6] border-2 resize-none"
            placeholder="توضیحات دوره را وارد کنید"
            name="description"
            onChange={(e) =>
              setValues((prev) => ({ ...prev, description: e.target.value }))
            }
            value={values.description}
            required
          ></Textarea>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <div className="ml-5">
            <Button
              variant={"ghost"}
              className="border-[#D6D6D6] bg-black/20 border-2 w-[100%] h-[45px] text-[16px]"
              type="button"
              disabled={isLoading}
              onClick={() => {
                setAlertType("get_code");
                setOpenAlert(true);
              }}
            >
              <BsShop />{" "}
              {course?.discount.code ? "تغییر کد تخفیف" : "افزودن کد تخفیف"}
            </Button>
          </div>

          <div>
            <Button
              variant={"ghost"}
              className="border-[#D6D6D6] border-2 w-[100%] h-[45px] text-[16px]"
              type="submit"
              disabled={!preview || isLoading || noChangeCourse()}
            >
              {isLoading ? (
                progress !== 0 ? (
                  `${progress}% درحال آپلود عکس`
                ) : (
                  "درحال ارسال"
                )
              ) : (
                <>
                  <span>ذخیره</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
    </form>
  );
}
