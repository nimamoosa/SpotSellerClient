"use client";

import AddCourse from "@/components/add_course";
import EditCourse from "@/components/edit_course";
import SalesReports from "@/components/sales_reports";
import ShowCourse from "@/components/show_course";
import { Spinner } from "@/components/ui/spinner";
import { useCourse } from "@/contexts/courseContext";
import { CourseType } from "@/types/course";
import { useCallback, useState } from "react";

export default function ManagementOfCourses() {
  const [type, setType] = useState<
    "add_course" | "show_course" | "edit_course" | "sales_reports"
  >("show_course");
  const [course, setCourse] = useState<CourseType>();

  const { courses, isLoadingCourse } = useCourse();

  const render = useCallback(() => {
    if (isLoadingCourse)
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner>لطفا صبر کنید....</Spinner>
        </div>
      );

    if (courses?.length === 0) {
      return <AddCourse backClick={() => setType("show_course")} />;
    }

    if (type === "add_course") {
      return <AddCourse backClick={() => setType("show_course")} />;
    }

    if (type === "show_course") {
      return (
        <ShowCourse
          addCourse={() => setType("add_course")}
          editCourse={(co) => {
            setType("edit_course");
            setCourse(co);
          }}
          saleState={(co) => {
            setType("sales_reports");
            setCourse(co);
          }}
        />
      );
    }

    if (type === "edit_course") {
      return (
        <EditCourse
          course={course}
          backClick={() => {
            setType("show_course");
            setCourse(undefined);
          }}
        />
      );
    }

    if (type === "sales_reports") {
      return (
        <SalesReports course={course} back={() => setType("show_course")} />
      );
    }
  }, [courses, isLoadingCourse, type]);

  return <div className="mt-9 w-full h-[60vh]">{render()}</div>;
}
