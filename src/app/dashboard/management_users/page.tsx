"use client";

import EditUserInfo from "@/components/edit_user_info";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { RegisteredUsersType } from "@/types/registeredUsersType";
import { TransactionUsersType } from "@/types/visit";
import { Ban, Check, Pen } from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { BsBucket } from "react-icons/bs";

export default function ManagementUsers() {
  const [userClick, setUserClick] = useState<RegisteredUsersType | null>(null);
  const [userPurchase, setUserPurchase] = useState<TransactionUsersType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const { registeredUsers, setRegisteredUsers, isLoadingRegisteredUsers } =
    useRegisteredUsers();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { user } = useAuth();
  const { transactions } = useTransaction();
  const { addLink, removeLink, addAlert } = useController();
  const { isLoading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    if (userClick && !userPurchase)
      return addLink("ویرایش کاربر", "management_of_user");

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
    receiverEvent("deleteUserEventReceiver", (data) => {
      stopLoading();
      setRegisteredUsers(data.data.authentications);
    });
  }, []);

  useEffect(() => {
    if (!userClick || !transactions.length) return;
    if (isEdit) return;

    const relatedTransactions = transactions.filter((transaction) =>
      transaction.users.some((user) => user.userId === userClick.userId)
    );

    const relatedUsers = relatedTransactions.flatMap(
      (transaction) => transaction.users
    );

    if (relatedUsers.length !== userPurchase.length) {
      setUserPurchase(relatedUsers);
    }
  }, [transactions, userClick, isEdit]);

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
    setUserClick(user);

    const tran = transactions.filter((item) =>
      item.users.find((item) => item.userId == user.userId)
    );

    const fix = tran.flat().flatMap((i) => i.users);

    if (fix.length < 0) return addAlert("این کاربر تراکنشی ندارد", "warning");

    setUserPurchase(fix);
  };

  const renderPage = useCallback(() => {
    if (isLoadingRegisteredUsers)
      return (
        <div className="flex items-center justify-center h-full">
          <Spinner>کمی صبر کنید....</Spinner>
        </div>
      );

    if (userClick && !openDialog && userPurchase?.length === 0)
      return <EditUserInfo userClick={userClick} setUserClick={setUserClick} />;

    if (userPurchase?.length !== 0)
      return (
        <ViewCustomerPurchaseHistory
          purchase={userPurchase}
          setUserPurchase={setUserPurchase}
          setUserClick={setUserClick}
        />
      );

    if (registeredUsers?.length !== 0) {
      return (
        <div>
          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-start">توجه</AlertDialogTitle>
                <AlertDialogDescription className="text-start">
                  آیا از حذف کاربر مطمئن هستید؟
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex gap-2">
                <AlertDialogCancel onClick={() => setUserClick(null)}>
                  خیر
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    startLoading();

                    setUserClick(null);

                    sendEvent("deleteUser", {
                      botId: user?.botId,
                      deleteUserId: userClick?.userId,
                    });
                  }}
                >
                  بله
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
                    <TableCell
                      className="h-[10vh] text-center flex items-center justify-evenly border-l border-gray-300"
                      dir="rtl"
                    >
                      <Button
                        className="bg-[#66BB00]/10 text-[#519506] hover:bg-[#66BB00]/20 rounded-full"
                        type="button"
                        disabled={isLoading}
                        onClick={() => {
                          setIsEdit(true);
                          setUserClick(item);
                        }}
                      >
                        <Pen /> ویرایش
                      </Button>

                      <Button
                        className="bg-[#BE6D05]/10 text-[#BE6D05] hover:bg-[#BE6D05]/20 rounded-full"
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleBanedUser(item.userId, !item.settings.is_banned)
                        }
                      >
                        {item.settings.is_banned ? <Check /> : <Ban />}{" "}
                        {item.settings?.is_banned ? "فعال کردن" : "مسدود کردن"}
                      </Button>

                      <Button
                        className="bg-red-700/90 text-white hover:bg-red-700/80 rounded-full"
                        type="button"
                        disabled={isLoading}
                        onClick={() => {
                          setUserClick(item);

                          setOpenDialog(true);
                        }}
                      >
                        <BsBucket /> حذف کاربر
                      </Button>
                    </TableCell>
                    <TableCell className="text-center p-4 border-l border-gray-300">
                      <Button
                        variant={"ghost"}
                        className="text-blue-500 hover:underline"
                        onClick={() => handleOnClick(item)}
                        disabled={isLoading}
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
        </div>
      );
    }

    return (
      <div className="h-[60vh] w-full flex items-center justify-center text-3xl">
        <p className="">کاربری یافت نشد!</p>
      </div>
    );
  }, [userClick, registeredUsers, userPurchase, isLoadingRegisteredUsers]);

  return <main className="h-full">{renderPage()}</main>;
}
