"use client";

import { CourseType } from "@/types/course";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./authContext";
import { useSocketRequest } from "@/hooks/useSocketRequest";

interface CourseContextProps {
  courses: CourseType[];
  setCourses: Dispatch<SetStateAction<CourseType[]>>;
  isLoadingCourse: boolean;
}

const CourseContext = createContext<CourseContextProps>({
  courses: [],
  setCourses: () => {},
  isLoadingCourse: true,
});

export default function CourseProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [isLoadingCourse, setLoadingCourse] = useState(true);

  const { user } = useAuth();

  const { sendEvent, receiverEvent } = useSocketRequest();

  useEffect(() => {
    if (user === null) return;

    sendEvent("getCourse", { botId: user.botId, userId: user.userId });

    receiverEvent("getCourseEventReceiver", (data) => {
      setLoadingCourse(false);

      if (!data.success) return;

      setCourses(data.data);
    });
  }, [user]);

  return (
    <CourseContext.Provider value={{ courses, setCourses, isLoadingCourse }}>
      {children}
    </CourseContext.Provider>
  );
}

export const useCourse = () => useContext(CourseContext);
