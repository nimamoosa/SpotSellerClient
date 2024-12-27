import { TransactionUsersType } from "@/types/visit";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useCourse } from "@/contexts/courseContext";
import { ScrollArea } from "./ui/scroll-area";
import { RegisteredUsersType } from "@/types/registeredUsersType";

export default function ViewCustomerPurchaseHistory({
  purchase,
  setUserPurchase,
  setUserClick,
}: {
  purchase: TransactionUsersType[];
  setUserPurchase: Dispatch<SetStateAction<TransactionUsersType[]>>;
  setUserClick: Dispatch<SetStateAction<RegisteredUsersType | null>>;
}) {
  const { courses } = useCourse();

  useEffect(() => {
    console.log(purchase.filter((item) => item.type === "cancel").length);
  }, [purchase]);

  const successButton = () => {
    return (
      <span className="bg-[#66BB00]/10 w-[126px] h-[35px] rounded-full text-[16px] flex items-center justify-center text-[#519506]">
        پرداخت شده
      </span>
    );
  };

  const inProgressButton = () => {
    return (
      <span className="bg-[#BB9C00]/10 w-[144px] h-[35px] rounded-full text-[16px] flex items-center justify-center text-[#956306]">
        در انتظار پرداخت
      </span>
    );
  };

  const cancelButton = () => {
    return (
      <span className="bg-[#BB0000]/10 w-[96px] h-[35px] rounded-full text-[16px] flex items-center justify-center text-[#950606]">
        لفو شده
      </span>
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between mt-2">
        <div>
          <p className="text-[23px]">آخرین گزارشات {purchase[0].name}</p>
        </div>

        <div>
          <Button
            onClick={() => {
              setUserPurchase([]);
              setUserClick(null);
            }}
          >
            بازگشت
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[70vh] mt-5">
        <div className="border border-[#D6D6D6] rounded-lg overflow-hidden">
          <Table className="w-full border-collapse" dir="ltr">
            <TableHeader>
              <TableRow className="bg-[#F6F6F6] border-b border-gray-300 *:p-5">
                <TableHead className="text-center border-l border-gray-300 w-[30%]">
                  عملیات
                </TableHead>
                <TableHead className="text-end border-l border-gray-300 w-[70%]">
                  عنوان دوره
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {purchase.map((item, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-100 border-b border-gray-300"
                >
                  <TableCell className="text-center flex items-center justify-evenly p-4 border-l border-gray-300">
                    {item.type === "success"
                      ? successButton()
                      : item.type === "cancel"
                      ? cancelButton()
                      : inProgressButton()}
                  </TableCell>

                  <TableCell className="text-end border-l border-gray-300">
                    <p className="mr-3">
                      {courses.find((course) => course._id === item._id)?.title}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </section>
  );
}
