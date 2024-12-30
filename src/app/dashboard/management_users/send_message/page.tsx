"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/authContext";
import { useController } from "@/contexts/controllerContext";
import { useRegisteredUsers } from "@/contexts/registeredUsersContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SendMessage() {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const [more, setMore] = useState<{
    glass_button: { text: string; callback_data: string }[];
  }>({ glass_button: [] });
  const [selectedUser, setSelectedUser] = useState(0);

  const router = useRouter();
  const { user } = useAuth();
  const { registeredUsers } = useRegisteredUsers();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { addAlert } = useController();
  const { isLoading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    receiverEvent("sendMessageForSignUpUsersEventReceiver", (data) => {
      stopLoading();

      if (!data.success) return addAlert(data.message, "error");

      return addAlert("پیام با موفقیت ارسال شد");
    });
  }, []);

  const sendMessageForUser = () => {
    startLoading();

    const buttons = more.glass_button.map((item) => {
      return [
        {
          ...item,
        },
      ];
    });

    sendEvent("sendMessageForSignUpUsers", {
      userId: user?.userId,
      senderIds: [selectedUser],
      text,
      extra: {
        reply_markup: {
          inline_keyboard: buttons,
        },
      },
    });
  };

  const sendMessageForAllUser = () => {
    startLoading();

    const buttons = more.glass_button.map((item) => {
      return [
        {
          ...item,
        },
      ];
    });

    sendEvent("sendMessageForSignUpUsers", {
      userId: user?.userId,
      text,
      senderIds: registeredUsers.map((item) => item.userId),
      extra: {
        reply_markup: {
          inline_keyboard: buttons,
        },
      },
    });
  };

  return (
    <div className="h-[100%]">
      <header className="h-[10%]">
        <div>
          <Button className="p-5" onClick={() => router.back()}>
            بازگشت
          </Button>
        </div>
      </header>

      <main className="w-full h-[90%] flex justify-center p-3">
        <Sheet open={show} onOpenChange={setShow}>
          <SheetContent>
            <SheetHeader className="mt-5">
              <SheetTitle className="text-start">بیشتر</SheetTitle>
              <SheetDescription className="text-start">
                تنظیمات ارسال پیام
              </SheetDescription>
            </SheetHeader>
            <div className="w-full mt-4 mb-4 flex flex-col gap-5 items-center justify-center">
              <div>
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    setMore((prev) => ({
                      ...prev,
                      glass_button: [
                        ...prev.glass_button,
                        {
                          text: "نمایش منو",
                          callback_data: "start:back",
                        },
                      ],
                    }));
                  }}
                  disabled={more.glass_button.length === 2}
                >
                  اضافه کردن دکمه شیشه ای
                </Button>
              </div>

              <div className="w-full flex flex-col items-center justify-center">
                <div className="w-[90%] min-h-[20vh] rounded-lg bg-black/20">
                  <p className="mt-1 mr-2 text-wrap whitespace-break-spaces">
                    {text}
                  </p>
                </div>

                <div className="flex flex-col w-[90%] gap-1 mt-2">
                  {more.glass_button.map((item, index) => {
                    return (
                      <div
                        suppressHydrationWarning
                        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-lg border-2 w-full h-[6vh]`}
                        key={index}
                        role="button"
                      >
                        <>
                          <div
                            className="absolute left-12 flex items-center justify-end"
                            suppressHydrationWarning
                          >
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  className="w-[8%] h-[3.5vh]"
                                  variant="outline"
                                >
                                  <ArrowDown />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium leading-none">
                                      داده برگشت
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      داده برگشت دکمه را انتخاب کنید
                                    </p>
                                  </div>
                                  <div className="grid gap-2">
                                    <Select
                                      dir="rtl"
                                      onValueChange={(value) => {
                                        setMore((prev) => {
                                          const findButton = [
                                            ...prev.glass_button,
                                          ];

                                          if (findButton[index]) {
                                            findButton[index] = {
                                              ...findButton[index],
                                              callback_data: value,
                                            };
                                          }

                                          return {
                                            ...prev,
                                            glass_button: findButton,
                                          };
                                        });
                                      }}
                                      value={
                                        more.glass_button[index].callback_data
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="انتخاب" />
                                      </SelectTrigger>

                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectItem value="start:back">
                                            نمایش دکمه های اولیه
                                          </SelectItem>
                                          <SelectItem value="course:back">
                                            نمایش دوره ها
                                          </SelectItem>
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div>
                            <Input
                              onChange={(e) => {
                                const newValue = e.target.value;

                                setMore((prev) => {
                                  const updatedGlassButton = [
                                    ...prev.glass_button,
                                  ];

                                  if (updatedGlassButton[index]) {
                                    updatedGlassButton[index] = {
                                      ...updatedGlassButton[index],
                                      text: newValue,
                                    };
                                  }

                                  return {
                                    ...prev,
                                    glass_button: updatedGlassButton,
                                  };
                                });
                              }}
                              value={item.text}
                              maxLength={15}
                              className="text-center"
                            />
                          </div>

                          <div
                            className="absolute right-12 bg-black text-white w-[8%] h-[3.5vh] flex items-center justify-center rounded-lg scale-[.95] z-50"
                            onClick={() => {
                              setMore((prev) => ({
                                ...prev,
                                glass_button: prev.glass_button.filter(
                                  (_, i) => i !== index
                                ),
                              }));
                            }}
                          >
                            X
                          </div>
                        </>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <SheetFooter className="w-full mt-10">
              <SheetClose asChild className="">
                <Button type="button">ذخیره</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Tabs
          defaultValue="send_for_all_user"
          className="w-full flex flex-col items-center justify-center"
        >
          <TabsList className="grid w-[35%] grid-cols-2">
            <TabsTrigger value="send_for_all_user">ارسال گروهی</TabsTrigger>
            <TabsTrigger value="send_for_user">ارسال به کاربر</TabsTrigger>
          </TabsList>

          <TabsContent value="send_for_all_user" className="h-[90%] w-full">
            <Card className="h-full" dir="rtl">
              <CardHeader className="text-center">
                <CardTitle>ارسال گروهی پیام</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Textarea
                    className="h-[35vh] resize-none"
                    spellCheck={false}
                    placeholder="متن پیام"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="gap-4">
                <Button
                  variant={"ghost"}
                  className="rounded-lg border-2 w-[9%] h-[6vh]"
                  onClick={() => setShow(true)}
                  disabled={isLoading}
                >
                  بیشتر
                </Button>

                <Button
                  variant={"ghost"}
                  className="rounded-lg border-2 w-[9%] h-[6vh]"
                  disabled={!text || isLoading}
                  onClick={sendMessageForAllUser}
                >
                  ارسال
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="send_for_user" className="h-[90%] w-full">
            <Card className="h-full" dir="rtl">
              <CardHeader className="text-center">
                <CardTitle>ارسال پیام به شخص خاص</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1 w-full mb-5">
                  <Select
                    dir="rtl"
                    onValueChange={(value) => setSelectedUser(Number(value))}
                  >
                    <SelectTrigger className="w-full h-[6vh]">
                      <SelectValue placeholder="انتخاب کاربر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup dir="rtl">
                        {registeredUsers.map((item, index) => {
                          return (
                            <SelectItem
                              key={index}
                              value={item.userId.toString()}
                            >
                              {item.name} - {item.phone_number}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Textarea
                    className="h-[30vh] resize-none"
                    placeholder="متن پیام"
                    spellCheck={false}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="gap-4">
                <Button
                  variant={"ghost"}
                  className="rounded-lg border-2 w-[9%] h-[6vh]"
                  onClick={() => setShow(true)}
                  disabled={isLoading}
                >
                  بیشتر
                </Button>

                <Button
                  variant={"ghost"}
                  className="rounded-lg border-2 w-[9%] h-[6vh]"
                  disabled={!text || !selectedUser || isLoading}
                  onClick={sendMessageForUser}
                >
                  ارسال
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
