"use client";

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
import { useAuth } from "@/contexts/authContext";
import { useController } from "@/contexts/controllerContext";
import { useLicense } from "@/contexts/licenseContext";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { useEffect } from "react";

export default function LicensePage() {
  const { licenses, loadingLicenses } = useLicense();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { user } = useAuth();
  const { setAlert } = useController();

  useEffect(() => {
    receiverEvent("sendMessageEventReceiver", () => {
      setAlert({ text: "لایسنس با موفقیت ارسال شد", type: "success" });
    });
  }, []);

  window;

  const sendTelegramUserLicense = (userId: number, text: string) => {
    sendEvent("telegramSendMessage", {
      receiverId: userId,
      botId: user?.botId,
      text,
    });
  };

  return (
    <main className="overflow-auto h-full">
      {loadingLicenses ? (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner>کمی صبر کنید...</Spinner>
        </div>
      ) : licenses ? (
        <div className="border border-[#D6D6D6] rounded-lg overflow-auto mb-5">
          <Table className="w-full border-collapse" dir="ltr">
            <TableHeader>
              <TableRow className="bg-[#F6F6F6] border-b border-gray-300 *:p-5">
                <TableHead className="text-center border-l border-gray-300">
                  عملیات
                </TableHead>
                <TableHead className="text-center border-l border-gray-300">
                  نام دوره
                </TableHead>
                <TableHead className="text-center border-l border-gray-300">
                  تاریخ خرید
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
              {licenses.map((item, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-100 border-b border-gray-300"
                >
                  <TableCell className="text-center flex items-center justify-evenly p-4 border-l border-gray-300">
                    <Button
                      className="bg-[#BE6D05]/10 -mr-5 text-[#BE6D05] hover:bg-[#BE6D05]/20 rounded-full"
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(item.course_id).then(() =>
                          setAlert({
                            text: "شناسه با موفقیت کپی شد",
                            type: "info",
                          })
                        )
                      }
                    >
                      کپی شناسه لایسنس
                    </Button>

                    <Button
                      className="bg-[#66BB00]/10 text-[#519506] hover:bg-[#66BB00]/20 rounded-full"
                      type="button"
                      onClick={() =>
                        sendTelegramUserLicense(
                          item.userId,
                          `لایسنس دوره ی ${item.course_name}:\n\n${item.license_key}`
                        )
                      }
                    >
                      ارسال لایسنس در تلگرام کاربر
                    </Button>
                  </TableCell>
                  <TableCell className="text-center p-4 border-l border-gray-300">
                    <p>{item.course_name}</p>
                  </TableCell>
                  <TableCell className="text-center p-4 border-l border-gray-300">
                    {item.time_created}
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
      ) : (
        <div className="flex items-center justify-center h-full text-2xl">
          <p>لایسنسی یافت نشد</p>
        </div>
      )}
    </main>
  );
}
