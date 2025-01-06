"use client";

import { CourseType } from "@/types/course";
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
import { useAuth } from "./authContext";
import { useSocketRequest } from "@/hooks/useSocketRequest";

type CourseAction =
  | { type: "ADD"; payload: CourseType }
  | { type: "EDIT"; payload: CourseType }
  | { type: "DELETE"; payload: { id: string } }
  | { type: "ADD_ARRAY"; payload: CourseType[] };

function courseReducer(state: CourseType[], action: CourseAction) {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "DELETE":
      return state.filter((course) => course.id !== action.payload.id);
    case "ADD_ARRAY":
      return action.payload;
    default:
      return state;
  }
}

interface CourseContextProps {
  courses: CourseType[];
  addCourse: (course: CourseType) => void;
  deleteCourse: (_id: string) => void;
  addArrayCourse: (course: CourseType[]) => void;
  isLoadingCourse: boolean;
}

const CourseContext = createContext<CourseContextProps>({
  courses: [],
  addCourse: () => {},
  deleteCourse: () => {},
  addArrayCourse: () => {},
  isLoadingCourse: true,
});

export default function CourseProvider({ children }: { children: ReactNode }) {
  const [courses, dispatchCourse] = useReducer(courseReducer, []);
  const [isLoadingCourse, setLoadingCourse] = useState(true);

  const { user } = useAuth();

  const { sendEvent, receiverEvent } = useSocketRequest();

  const addCourse = (course: CourseType) => {
    dispatchCourse({ type: "ADD", payload: course });
  };

  const deleteCourse = (id: string) => {
    dispatchCourse({ type: "DELETE", payload: { id } });
  };

  const addArrayCourse = (courses: CourseType[]) => {
    dispatchCourse({ type: "ADD_ARRAY", payload: courses });
  };

  useEffect(() => {
    if (user === null) return;

    sendEvent("getCourse", { botId: user.botId, userId: user.userId });

    receiverEvent("getCourseEventReceiver", (data) => {
      setLoadingCourse(false);

      if (!data.success) return;

      const format = data.data.map((item: any) => {
        return {
          id: item._id,
          ...item,
        };
      });

      addArrayCourse(format);
    });
  }, [user]);

  return (
    <CourseContext.Provider
      value={{
        courses,
        addCourse,
        deleteCourse,
        addArrayCourse,
        isLoadingCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export const useCourse = () => useContext(CourseContext);
