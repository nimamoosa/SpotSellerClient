"use client";

import { Plus, Search } from "lucide-react";
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
import { useEffect } from "react";
import { CourseType } from "@/types/course";

export default function ShowCourse({
  addCourse,
  editCourse,
  saleState,
}: {
  addCourse?: () => void;
  editCourse?: (course: CourseType) => void;
  saleState?: (course: CourseType) => void;
}) {
  const { courses, setCourses } = useCourse();

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
        <Table
          className="overflow-auto rounded-lg border-2 border-[#D6D6D6]"
          style={{ borderCollapse: "separate" }}
        >
          <TableHeader className="w-full">
            <TableRow className="font-medium text-[16px]">
              <TableHead className="w-[70%] border-l-[1px] p-4 border-l-[#C6C6C6] rounded-tr-lg bg-[#F6F6F6] text-start">
                <p className="mr-3 w-fit">عنوان دوره</p>
              </TableHead>
              <TableHead className="w-[30%] rounded-tl-lg bg-[#F6F6F6] text-center">
                <p>عملیات</p>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses?.map((item, index) => {
              return (
                <TableRow className="hover:bg-transparent" key={index}>
                  <TableCell className="font-medium border-l-[1px] text-[16px] border-l-[#C6C6C6]">
                    <p className="mr-5">{item.title}</p>
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <div className="ml-2">
                      <Button
                        className="bg-[#66BB00]/10 rounded-[71px] text-[#519506] hover:bg-[#66BB00]/20"
                        onClick={() => editCourse && editCourse(item)}
                      >
                        ویرایش
                      </Button>
                    </div>

                    <div>
                      <Button
                        className="bg-[#BE6D05]/10 text-[#BE6D05] rounded-[71px] hover:bg-[#BE6D05]/20"
                        onClick={() => saleState && saleState(item)}
                      >
                        وضعیت فروش
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
