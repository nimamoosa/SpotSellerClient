"use client";

import { useEffect, useState } from "react";
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
import { useController } from "@/contexts/controllerContext";
import { Events, ReceiverEvents } from "@/enum/event";
import Compressor from "compressorjs";

export default function AddCourse({ backClick }: { backClick: () => void }) {
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
  const [downloadLink, setDownloadLink] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [authorizationToken, setAuthorizationToken] = useState("");

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { addArrayCourse, courses } = useCourse();
  const { user } = useAuth();
  const { addAlert } = useController();

  useEffect(() => {
    receiverEvent(ReceiverEvents.UPLOAD_FILE, (data) => {
      if (data.success === false) {
        return addAlert("آپلود عکس به مشکل خورد", "error");
      }

      if (data.progress) {
        setProgress(data.progress);
        return;
      }

      if (!data.downloadLink) return;

      setDownloadLink(data.downloadLink);
      setAuthorizationToken("");
    });
  }, []);

  useEffect(() => {
    receiverEvent(ReceiverEvents.CREATE_COURSE, (data) => {
      if (!data.success) return;

      const format = data.data.courses.map((item: any) => {
        return {
          id: item._id,
          ...item,
        };
      });

      addArrayCourse(format);

      backClick();
      stopLoading();
    });
  }, []);

  useEffect(() => {
    if (!downloadLink) return;
    if (!user) return;
    if (!values) return;

    sendEvent(Events.CREATE_COURSE, {
      course: {
        courseId: values.course_id,
        title: values.title,
        description: values.description.trim(),
        media_url: downloadLink,
        discount: {
          code: discountCode,
          amount: discountAmount,
        },
        amount: values.amount,
      },
      botId: user.botId,
      userId: user.userId,
    });

    setDownloadLink("");
  }, [downloadLink, user, values, discountCode, discountAmount]);

  useEffect(() => {
    if (!authorizationToken) return;
    if (!user) return;
    if (!selectedFile) return;

    uploadFile(selectedFile, user.name, user.userId, user.botId);
  }, [authorizationToken, user, selectedFile, sendEvent]);

  useEffect(() => {
    receiverEvent(ReceiverEvents.TOKEN_FOR_UPLOAD_FILE, (data) => {
      if (!data.success) return addAlert(data.message, "error");

      setAuthorizationToken(data.token);
    });
  }, [receiverEvent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const compressFile = (
        file: File,
        maxSizeInMB: number = 1,
        quality: number = 0.5
      ): Promise<File> => {
        return new Promise((resolve, reject) => {
          if (!file) {
            reject(new Error("No file provided for compression."));
            return;
          }

          // Check if the file is already under the size limit
          const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
          if (file.size <= maxSizeInBytes) {
            resolve(file);
            return;
          }

          new Compressor(file, {
            quality, // Initial quality setting
            maxWidth: 1920, // Set max width for resizing (optional)
            maxHeight: 1080, // Set max height for resizing (optional)
            convertSize: maxSizeInBytes, // Automatically compress if larger than max size
            mimeType: "image/webp", // Convert to WebP format using mimeType
            success(compressedFile) {
              // Verify compressed file size
              if (compressedFile.size <= maxSizeInBytes) {
                resolve(compressedFile as File);
              } else {
                // Further compress if needed
                reject(
                  new Error(
                    "File could not be compressed under the desired size."
                  )
                );
              }
            },
            error(err) {
              reject(err);
            },
          });
        });
      };

      const compressed = await compressFile(file);

      setSelectedFile(file);
      setPreview(URL.createObjectURL(compressed));
    }
  };

  const uploadFile = (
    file: File | null | undefined,
    name: string | undefined,
    userId: number | undefined,
    botId: number | undefined
  ) => {
    if (!file) return;

    const chunkSize = 32 * 1024; // 32KB per chunk
    const totalChunks = Math.ceil(file.size / chunkSize);
    let chunkIndex = 0;

    const compressFile = (
      file: File,
      maxSizeInMB: number = 1,
      quality: number = 0.5
    ): Promise<File> => {
      return new Promise((resolve, reject) => {
        if (!file) {
          reject(new Error("No file provided for compression."));
          return;
        }

        // Check if the file is already under the size limit
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (file.size <= maxSizeInBytes) {
          resolve(file);
          return;
        }

        new Compressor(file, {
          quality, // Initial quality setting
          maxWidth: 1920, // Set max width for resizing (optional)
          maxHeight: 1080, // Set max height for resizing (optional)
          convertSize: maxSizeInBytes, // Automatically compress if larger than max size
          mimeType: "image/webp", // Convert to WebP format using mimeType
          success(compressedFile) {
            // Verify compressed file size
            if (compressedFile.size <= maxSizeInBytes) {
              resolve(compressedFile as File);
            } else {
              // Further compress if needed
              reject(
                new Error(
                  "File could not be compressed under the desired size."
                )
              );
            }
          },
          error(err) {
            reject(err);
          },
        });
      });
    };

    const sendChunk = (file: File) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);

        const chunk = file.slice(start, end);

        reader.onloadend = () => {
          const data = {
            chunk: reader.result,
            chunkIndex,
            totalChunks,
            filename: file.name,
            userId,
            botId,
            type: "images",
            name,
            token: authorizationToken,
          };

          sendEvent(Events.UPLOAD_FILE, data);

          if (chunkIndex + 1 < totalChunks) {
            chunkIndex++;
            resolve();
          } else {
            resolve();
          }
        };

        reader.onerror = (error) => {
          console.error("Upload error:", error);
          reject(error);
        };

        reader.readAsDataURL(chunk);
      });
    };

    const uploadChunksSequentially = async (compressedFile: File) => {
      try {
        for (let i = chunkIndex; i < totalChunks; i++) {
          await sendChunk(compressedFile);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    };

    // Compress and upload
    compressFile(file).then((compressedFile) => {
      uploadChunksSequentially(compressedFile);
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (selectedFile === null)
          return addAlert("شما باید حداقل یک عکس اضافه کنید", "warning");

        startLoading();

        if (courses.some((course) => course.courseId === values.course_id)) {
          stopLoading();
          return addAlert("این شناسه دوره قبلا ثبت شده است", "error");
        }

        return sendEvent(Events.TOKEN_FOR_UPLOAD_FILE, {
          userId: user?.userId,
        });
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
                  ? "bg-black/30 shadow-2xl p-2"
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
                    setOpenAlert(true);
                    setAlertType("preview_image");
                  }}
                />
              ) : (
                <span className="text-[18px] w-full text-[#7D7D7D]">
                  تصویر کاور
                </span>
              )}
            </div>

            <div className="">
              <Button
                className="bg-[#BE6D05]/10 rounded-[46px] w-full h-[40px] text-[#BE6D05] text-[17px]"
                onClick={() => document.getElementById("choose_file")?.click()}
                type="button"
                disabled={isLoading}
              >
                انتخاب فایل
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
            onChange={(v) => setValues({ ...values, amount: Number(v) })}
            value={values.amount !== 0 ? String(values.amount) : ""}
            placeholder="مبلغ دوره"
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
                setOpenAlert(true);
                setAlertType("discount_code");
              }}
            >
              <BsShop /> اعمال کد نخفیف
            </Button>
          </div>

          <div>
            <Button
              variant={"ghost"}
              className="border-[#D6D6D6] border-2 w-[100%] h-[45px] text-[16px]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                progress !== 0 ? (
                  `${progress}% درحال آپلود عکس`
                ) : (
                  "درحال ارسال"
                )
              ) : (
                <>
                  <span className="text-[18px] font-bold">+</span> افزودن دوره
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
    </form>
  );
}
