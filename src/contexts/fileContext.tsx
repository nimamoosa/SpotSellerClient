"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useCourse } from "./courseContext";
import { EncJET } from "@/funcs/encryptions";

type FileType = {
  file: string;
  type: string;
  controllerId: string;
};

type FileAction =
  | { type: "ADD"; payload: FileType }
  | { type: "REMOVE"; payload: { controllerId: string } };

function fileReducer(state: FileType[], action: FileAction): FileType[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];

    case "REMOVE":
      return state.filter(
        (file) => file.controllerId !== action.payload.controllerId
      );

    default:
      return state;
  }
}

interface FileContextProps {
  fileUrls: FileType[];
  addFile: (file: string, type: string, controllerId: string) => void;
  removeFile: (controllerId: string) => void;
}

const FileContext = createContext<FileContextProps>({
  fileUrls: [],
  addFile: () => {},
  removeFile: () => {},
});

export default function FileProvider({ children }: { children: ReactNode }) {
  const [fileUrls, dispatchFile] = useReducer(fileReducer, []);
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

        updatedFileUrls.forEach((file) => {
          dispatchFile({ type: "ADD", payload: file });
        });
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

  const addFile = (file: string, type: string, controllerId: string) => {
    dispatchFile({ type: "ADD", payload: { file, type, controllerId } });
  };

  const removeFile = (controllerId: string) => {
    dispatchFile({ type: "REMOVE", payload: { controllerId } });
  };

  return (
    <FileContext.Provider value={{ fileUrls, addFile, removeFile }}>
      {children}
    </FileContext.Provider>
  );
}

export const useFile = () => useContext(FileContext);
