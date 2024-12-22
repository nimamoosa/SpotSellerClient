"use client";

import EditUserInfo from "@/components/edit_user_info";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ViewCustomerPurchaseHistory from "@/components/view_customer_purchase_history";
import { useAuth } from "@/contexts/authContext";
import { useController } from "@/contexts/controllerContext";
import { useRegisteredUsers } from "@/contexts/registeredUsersContext";
import { useTransaction } from "@/contexts/transactionContext";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { RegisteredUsersType } from "@/types/registeredUsersType";
import { TransactionUsersType } from "@/types/visit";
import { Fragment, useCallback, useEffect, useState } from "react";

export default function ManagementUsers() {
  const [userClick, setUserClick] = useState<RegisteredUsersType | null>(null);
  const [userPurchase, setUserPurchase] = useState<TransactionUsersType[]>([]);

  const { registeredUsers, setRegisteredUsers } = useRegisteredUsers();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { user } = useAuth();
  const { transactions } = useTransaction();
  const { addLink, removeLink, setAlert } = useController();

  useEffect(() => {
    if (userClick) return addLink("ویرایش کاربر", "management_of_user");

    if (userPurchase.length !== 0)
      return addLink("گزارشات", "management_of_user");

    removeLink("management_of_user");
  }, [userClick, userPurchase]);

  useEffect(() => {
    receiverEvent("updateBanStatusEventReceiver", (data) => {
      if (data.success == false) return;

      setRegisteredUsers(data.data.authentications);
    });
  }, []);

  useEffect(() => {
    console.log(userPurchase);
  }, [userPurchase]);

  const handleBanedUser = useCallback(
    (userId: number, status: boolean) => {
      if (!user) return;

      sendEvent("updateBan", {
        userId,
        botId: user.botId,
        status,
      });
    },
    [user]
  );

  const handleOnClick = (user: RegisteredUsersType) => {
    const tran = transactions.filter((item) =>
      item.users.find((item) => item.userId == user.userId)
    );

    const fix = tran.flat().flatMap((i) => i.users);

    if (fix.length < 0)
      return setAlert({ text: "این کاربر تراکنشی ندارد", type: "warning" });

    setUserPurchase(fix);
  };

  const renderPage = useCallback(() => {
    if (userClick)
      return <EditUserInfo userClick={userClick} setUserClick={setUserClick} />;

    if (userPurchase?.length !== 0)
      return (
        <ViewCustomerPurchaseHistory
          purchase={userPurchase}
          setUserPurchase={setUserPurchase}
        />
      );

    if (registeredUsers?.length >= 0 && userPurchase?.length === 0) {
      return (
        <div className="border border-[#D6D6D6] rounded-lg overflow-hidden">
          <Table className="w-full border-collapse" dir="ltr">
            <TableHeader>
              <TableRow className="bg-[#F6F6F6] border-b border-gray-300 *:p-5">
                <TableHead className="text-center border-l border-gray-300">
                  عملیات
                </TableHead>
                <TableHead className="text-center border-l border-gray-300">
                  گزارشات
                </TableHead>
                <TableHead className="text-center border-l border-gray-300">
                  تاریخ ثبت نام
                </TableHead>
                <TableHead className="text-center border-l border-gray-300">
                  شماره تماس
                </TableHead>
                <TableHead className="text-center border-l border-gray-300">
                  نام کاربر
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registeredUsers.map((item, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-100 border-b border-gray-300"
                >
                  <TableCell className="text-center flex items-center justify-evenly p-4 border-l border-gray-300">
                    <Button
                      className="bg-[#BE6D05]/10 -mr-5 text-[#BE6D05] hover:bg-[#BE6D05]/20 rounded-full"
                      type="button"
                      onClick={() =>
                        handleBanedUser(item.userId, !item.settings.is_banned)
                      }
                    >
                      {item.settings?.is_banned ? "فعال کردن" : "مسدود کردن"}
                    </Button>

                    <Button
                      className="bg-[#66BB00]/10 text-[#519506] hover:bg-[#66BB00]/20 rounded-full"
                      type="button"
                      onClick={() => setUserClick(item)}
                    >
                      ویرایش
                    </Button>
                  </TableCell>
                  <TableCell className="text-center p-4 border-l border-gray-300">
                    <Button
                      variant={"ghost"}
                      className="text-blue-500 hover:underline"
                      onClick={() => handleOnClick(item)}
                    >
                      مشاهده سابقه خرید مشتری
                    </Button>
                  </TableCell>
                  <TableCell className="text-center p-4 border-l border-gray-300">
                    {item.time_join}
                  </TableCell>
                  <TableCell className="text-center p-4 border-l border-gray-300">
                    {item.phone_number}
                  </TableCell>
                  <TableCell className="text-center border-l border-gray-300">
                    {item.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    return (
      <div className="h-full w-full flex items-center justify-center text-3xl">
        <p className="">کاربری یافت نشد!</p>
      </div>
    );
  }, [userClick, registeredUsers, userPurchase]);

  return <main className="h-full overflow-auto">{renderPage()}</main>;
}
