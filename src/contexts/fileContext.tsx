"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCourse } from "./courseContext";
import { EncJET } from "@/funcs/encryptions";

interface FileContextProps {
  fileUrls: {
    file: string;
    type: string;
    controllerId: string;
  }[];
  setFileUrls: Dispatch<
    SetStateAction<
      {
        file: string;
        type: string;
        controllerId: string;
      }[]
    >
  >;
}

const FileContext = createContext<FileContextProps>({
  fileUrls: [],
  setFileUrls: () => {},
});

export default function FileProvider({ children }: { children: ReactNode }) {
  const [fileUrls, setFileUrls] = useState<
    { file: string; type: string; controllerId: string }[]
  >([]);
  const { courses } = useCourse();

  useEffect(() => {
    if (!courses?.length || courses.length === 0) return;

    const fetchFiles = async () => {
      try {
        const blobs = await Promise.all(
          courses.map(async (course) => {
            try {
              const response = await fetch(
                course.media_url.replace(
                  "auth",
                  EncJET(
                    JSON.stringify({
                      date: new Date(new Date().getTime() + 1 * 60 * 1000),
                    }),
                    process.env.NEXT_PUBLIC_ENC_SECRET
                  )
                )
              );

              return {
                blob: await response.blob(),
                controllerId: course._id,
              };
            } catch (error) {
              return null; // Return null to handle errors gracefully
            }
          })
        );

        // Filter out any null results due to errors
        const validBlobs = blobs.filter((blob) => blob !== null) as {
          blob: Blob;
          controllerId: string;
        }[];

        // Convert blobs to URLs and add them to the state
        const updatedFileUrls = validBlobs.map(({ blob, controllerId }) => ({
          file: URL.createObjectURL(blob),
          type: "course",
          controllerId: controllerId,
        }));

        setFileUrls((prev) => [...prev, ...updatedFileUrls]);
      } catch (error) {
        return null;
      }
    };

    fetchFiles();

    // Cleanup: Revoke blob URLs to avoid memory leaks
    return () => {
      fileUrls.forEach((file) => URL.revokeObjectURL(file.file));
    };
  }, [courses]);

  return (
    <FileContext.Provider value={{ fileUrls, setFileUrls }}>
      {children}
    </FileContext.Provider>
  );
}

export const useFile = () => useContext(FileContext);
