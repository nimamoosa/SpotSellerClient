"use client";

import { Fragment, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import useLoading from "@/hooks/useLoading";
import { useAuth } from "@/contexts/authContext";
import { toast } from "@/hooks/use-toast";
import { useCourse } from "@/contexts/courseContext";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const CHUNK_SIZE = 1024 * 1024;

export default function AddCourse({ backClick }: { backClick: () => void }) {
  const [values, setValues] = useState<{
    title: string;
    course_id: string;
    description: string;
  }>({
    title: "",
    course_id: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { setCourses, courses } = useCourse();
  const { user } = useAuth();

  useEffect(() => {
    receiverEvent("uploadFileEventReceiver", (data) => {
      if (data.success === false) return;

      if (data.progress) {
        setProgress(data.progress);
        return;
      }

      if (!data.downloadLink) return;

      setDownloadLink(data.downloadLink);
    });
  }, []);

  useEffect(() => {
    receiverEvent("createCourseEventReceiver", (data) => {
      if (!data.success) return;

      setCourses(data.data.courses);
      backClick();
      stopLoading();
    });
  }, []);

  useEffect(() => {
    if (!downloadLink) return;
    if (!user) return;
    if (!values) return;

    sendEvent("createCourse", {
      course: {
        courseId: values.course_id,
        title: values.title,
        description: values.description,
        media_url: downloadLink,
      },
      botId: user.botId,
      userId: user.userId,
    });

    setDownloadLink("");
  }, [downloadLink, user, values]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

    const chunkSize = 1024 * 1024; // 1 MB per chunk (adjust as necessary)
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

  return (
    <form
      className=""
      onSubmit={(e) => {
        e.preventDefault();

        if (selectedFile === null)
          return alert("شما باید حداقل یک عکس اضافه کنید");

        startLoading();

        return uploadFile(selectedFile, "nima", user?.userId, user?.botId);
      }}
    >
      <AlertDialog open={showImage} onOpenChange={setShowImage}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle></AlertDialogTitle>
            <AlertDialogDescription className="w-full">
              <img className="w-full rounded-lg" src={preview} alt="" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>بستن</AlertDialogCancel>
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
                  onClick={() => setShowImage(true)}
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

      <section className="mt-5">
        <div className="flex justify-between mb-5">
          <div>
            <Input
              placeholder="عنوان دوره"
              className="w-[545px] h-[62px] rounded-[10px] border-[#D6D6D6] border-2"
              name="title"
              onChange={handleChange}
              value={values.title}
              required
            />
          </div>

          <div>
            <Input
              placeholder="شناسه دوره را وارد کنید"
              className="w-[545px] h-[62px] rounded-[10px] border-[#D6D6D6] border-2"
              name="course_id"
              onChange={handleChange}
              value={values.course_id}
              required
            />
          </div>
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
          <Button
            variant={"ghost"}
            className="border-[#D6D6D6] border-2 w-[155px] h-[45px] text-[18px]"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              progress > 100 ? (
                `${progress} درحال آپلود عکس`
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
      </section>
    </form>
  );
}
