"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/authContext";
import { useController } from "@/contexts/controllerContext";
import { useCourse } from "@/contexts/courseContext";
import { useFile } from "@/contexts/fileContext";
import { Enc } from "@/funcs/encryptions";
import { CourseType } from "@/types/course";
import { Separator } from "@radix-ui/react-select";
import { randomBytes } from "crypto";
import { ArrowLeft, ArrowUpLeft, Delete, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type MainLayout = {
  main_section: {
    blur: string;
    image: string;
    title: string;
    description: string;
    button: {
      content: string;
      link: string;
    };
  };

  sub_main_section: {
    sec_1: {
      cards: { content: string; image: string; id: number }[];
    };
    sec_2: {
      title: string;
      accordion: { title: string; description: string; id: number }[];
    };
  };

  second_section: {
    courses: CourseType[];
  };
};

export default function CreateSite() {
  const router = useRouter();
  const { setNode, node, setLayoutInfo, layoutInfo, addAlert } =
    useController();
  const { user } = useAuth();
  const { courses } = useCourse();
  const { fileUrls } = useFile();

  const forHeader = layoutInfo as {
    header: { title: string; image: string };
    fixed_header: boolean;
  };

  const forMain = layoutInfo as {
    main: MainLayout;
  };

  type layoutOne = {
    header: { title: string; image: string };
    fixed_header: boolean;
    main: MainLayout;
  };

  const [backgroundColor, setBackgroundColor] = useState(
    node?.bgColor || "#00000"
  );
  const [setting, setSetting] = useState<{
    fixed_header: boolean;
    header: { image: string; title: string };
    link: string;
  }>({
    fixed_header: forHeader?.fixed_header || false,
    header: {
      image: forHeader?.header?.image || "/icon.svg",
      title: forHeader?.header?.title || "به اسپات سلر خوش آمدید",
    },
    link: Enc(
      user?.userId.toString() || "empty",
      process.env.NEXT_PUBLIC_ENC_SECRET
    ).slice(0, 10),
  });
  const [accordion, setAccordion] = useState<{
    id: number;
    title: string;
    description: string;
  } | null>(null);
  const [card, setCard] = useState<{
    content: string;
    image: string;
    id: number;
  } | null>(null);

  useEffect(() => {
    document.onkeyup = (e) => {
      if (e.altKey && e.key === "1") {
        console.log("true");
      }

      switch (e.key) {
        case "Escape":
          setNode({ el: layouts[0].node, bgColor: backgroundColor });

          setLayoutInfo({ ...setting });

          router.back();
          return;
      }
    };
  }, []);

  useEffect(() => {
    console.log("layoutInfo:", layoutInfo);
  }, [layoutInfo]);

  const layouts = [
    {
      id: "layout_1",
      node: (
        <div slot="layout_1" className="flex flex-col items-center h-full">
          <Popover>
            <PopoverTrigger asChild>
              <div
                className="w-[95%] h-[80vh] mt-3 rounded-lg flex items-center justify-around"
                style={{
                  backgroundColor: `rgb(0 0 0 / ${
                    Number(forMain?.main?.main_section?.blur || 50) / 100
                  })`,
                }}
              >
                <div className="w-[45%] h-full flex flex-col gap-10 items-center justify-center p-2">
                  <div className="text-center">
                    <p className="mb-5 text-3xl bg-transparent">
                      {forMain?.main?.main_section?.title || "نیما موسی رضایی"}
                    </p>
                    <p className="text-xl text-white/80">
                      {forMain?.main?.main_section?.description ||
                        "معلم پایه یک فیزیک"}
                    </p>
                  </div>

                  <div>
                    <a
                      href={
                        forMain?.main?.main_section?.button?.link ||
                        "https://instagram.com/nima"
                      }
                      target="_blank"
                    >
                      <Button>
                        {forMain?.main?.main_section?.button?.content ||
                          "پیج اینستا"}
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="w-[45%]">
                  <img
                    src={
                      forMain?.main?.main_section?.image ||
                      "/ارشد-1024x576 (1).jpg"
                    }
                    className="rounded-xl w-full max-h-[700px]"
                    alt=""
                  />
                </div>
              </div>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] grid gap-4">
              <div className="flex flex-col gap-3">
                <div>
                  <p>بلر</p>
                </div>
                <div>
                  <Slider
                    defaultValue={[30]}
                    max={50}
                    step={1}
                    onValueChange={(value) => {
                      setLayoutInfo((prev: layoutOne) => {
                        if (prev) {
                          return {
                            ...prev,
                            main: {
                              ...(prev.main || {}),
                              main_section: {
                                ...(prev.main.main_section || {}),
                                blur: value[0],
                              },
                            },
                          };
                        }

                        return {
                          main: { main_section: { blur: value[0] } },
                        };
                      });
                    }}
                  />
                </div>
              </div>

              <DropdownMenuSeparator />

              <div className="h-full flex items-center justify-center">
                <Button
                  variant={"ghost"}
                  type="button"
                  className="cursor-pointer flex items-center justify-center w-full"
                >
                  <Label
                    htmlFor="choose_file_header"
                    className="cursor-pointer h-full w-full flex items-center justify-center"
                  >
                    <Input
                      id="choose_file_header"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const fileSelect = e.target.files;
                        if (
                          fileSelect &&
                          !fileSelect[0].type.startsWith("image")
                        ) {
                          addAlert("فایل معتبر نمیباشد", "error");
                          e.target.value = "";
                          return;
                        }

                        if (fileSelect) {
                          const file = fileSelect[0];

                          const blob = new Blob([file], {
                            type: file.type,
                          });

                          const blobUrl = URL.createObjectURL(blob);

                          setLayoutInfo((prev: layoutOne) => {
                            if (prev) {
                              return {
                                ...prev,
                                main: {
                                  ...prev.main,
                                  main_section: {
                                    ...prev.main.main_section,
                                    image: blobUrl,
                                  },
                                },
                              };
                            }

                            return {
                              main: {
                                main_section: {
                                  image: blobUrl,
                                },
                              },
                            };
                          });

                          e.target.value = "";
                        }
                      }}
                    />
                    <p>عکس این بخش</p>
                  </Label>
                </Button>
              </div>

              <DropdownMenuSeparator />

              <div>
                <Input
                  value={forMain?.main?.main_section?.title || ""}
                  placeholder="تایتل"
                  onChange={(e) => {
                    const value = e.target.value;

                    setLayoutInfo((prev: layoutOne) => {
                      if (prev) {
                        return {
                          ...prev,
                          main: {
                            ...prev.main,
                            main_section: {
                              ...prev.main.main_section,
                              title: value,
                            },
                          },
                        };
                      }

                      return { main: { main_section: { title: value } } };
                    });
                  }}
                />
              </div>

              <DropdownMenuSeparator />

              <div>
                <Textarea
                  className="resize-none"
                  value={forMain?.main?.main_section?.description || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    setLayoutInfo((prev: layoutOne) => {
                      if (prev) {
                        return {
                          ...prev,
                          main: {
                            ...prev.main,
                            main_section: {
                              ...prev.main.main_section,
                              description: value,
                            },
                          },
                        };
                      }

                      return { main: { main_section: { description: value } } };
                    });
                  }}
                  placeholder="توضیحات"
                />
              </div>

              <DropdownMenuSeparator />

              <div className="grid gap-4">
                <Input
                  value={forMain?.main?.main_section?.button?.content || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    setLayoutInfo((prev: layoutOne) => {
                      if (prev) {
                        return {
                          ...prev,
                          main: {
                            ...prev.main,
                            main_section: {
                              ...prev.main.main_section,
                              button: {
                                ...prev.main.main_section.button,
                                content: value,
                              },
                            },
                          },
                        };
                      }

                      return {
                        main: { main_section: { button: { content: value } } },
                      };
                    });
                  }}
                  placeholder="نوشته ی دکمه"
                />

                <Input
                  value={forMain?.main?.main_section?.button?.link || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    setLayoutInfo((prev: layoutOne) => {
                      if (prev) {
                        return {
                          ...prev,
                          main: {
                            ...prev.main,
                            main_section: {
                              ...prev.main.main_section,
                              button: {
                                ...prev.main.main_section.button,
                                link: value,
                              },
                            },
                          },
                        };
                      }

                      return {
                        main: { main_section: { button: { link: value } } },
                      };
                    });
                  }}
                  placeholder="لینک دکمه"
                />
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-[98%] h-full flex justify-around mt-10 mb-5">
            <div className="w-[45%] flex flex-col items-center justify-center text-black">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="text-black mb-2 ml-1">
                    <Edit />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="bg-black/90 text-white border-none">
                  <div className="flex flex-col items-center justify-center">
                    <Button
                      variant={"secondary"}
                      onClick={() => {
                        setLayoutInfo((prev: layoutOne) => {
                          return {
                            ...(prev || {}),
                            main: {
                              ...(prev?.main || {}),
                              sub_main_section: {
                                ...(prev?.main?.sub_main_section || {}),
                                sec_1: {
                                  cards: [
                                    ...(prev?.main?.sub_main_section?.sec_1
                                      ?.cards || []),
                                    {
                                      content: `lorem ispum ${
                                        prev?.main?.sub_main_section?.sec_1
                                          ?.cards?.length + 1 || 1
                                      }`,
                                      image:
                                        "https://tecdn.b-cdn.net/img/Photos/Others/mewa.jpg",
                                      id:
                                        prev?.main?.sub_main_section?.sec_1
                                          ?.cards?.length + 1 || 1,
                                    },
                                  ],
                                },
                              },
                            },
                          } as layoutOne;
                        });
                      }}
                      disabled={
                        forMain?.main?.sub_main_section?.sec_1?.cards
                          ?.length === 4
                      }
                    >
                      اضافه کردن کارت
                    </Button>

                    <Separator className="bg-white text-white h-[1px] mt-2 mb-2 w-full" />

                    <div className="grid gap-3">
                      {forMain?.main?.sub_main_section?.sec_1?.cards?.map(
                        (item, index) => {
                          return (
                            <div
                              className="flex items-center justify-center gap-3"
                              key={index}
                            >
                              <span>
                                <Delete
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setLayoutInfo((prev: layoutOne) => {
                                      if (
                                        prev?.main?.sub_main_section?.sec_1
                                          ?.cards
                                      ) {
                                        const updatedCards =
                                          prev.main.sub_main_section.sec_1.cards.filter(
                                            (card) =>
                                              card.content !== item.content
                                          );

                                        return {
                                          ...prev,
                                          main: {
                                            ...(prev?.main || {}),
                                            sub_main_section: {
                                              ...(prev?.main
                                                ?.sub_main_section || {}),
                                              sec_1: {
                                                ...(prev?.main?.sub_main_section
                                                  ?.sec_1 || {}),
                                                cards: updatedCards,
                                              },
                                            },
                                          },
                                        };
                                      }

                                      return prev;
                                    });
                                  }}
                                />
                              </span>

                              <AlertDialog
                                onOpenChange={(v) => !v && setCard(null)}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className="bg-transparent"
                                    onClick={() => {
                                      setCard(item);
                                    }}
                                  >
                                    <p>{item.content}</p>
                                  </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-start">
                                      تنظیمات
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-start text-black grid gap-5">
                                      <Input
                                        value={item.content}
                                        onChange={(e) => {
                                          setCard((prev) => {
                                            if (prev) {
                                              return {
                                                ...prev,
                                                content: e.target.value,
                                              };
                                            }

                                            return prev;
                                          });

                                          setLayoutInfo((prev: layoutOne) => {
                                            const findCard =
                                              prev?.main?.sub_main_section?.sec_1?.cards?.find(
                                                (item) => item.id === card?.id
                                              );

                                            if (findCard) {
                                              const updatedCards =
                                                prev.main.sub_main_section.sec_1.cards.map(
                                                  (item) =>
                                                    item.id === card?.id
                                                      ? {
                                                          ...item,
                                                          content:
                                                            e.target.value,
                                                        }
                                                      : item
                                                );

                                              return {
                                                ...prev,
                                                main: {
                                                  ...prev.main,
                                                  sub_main_section: {
                                                    ...prev.main
                                                      .sub_main_section,
                                                    sec_1: {
                                                      ...prev.main
                                                        .sub_main_section.sec_1,
                                                      cards: updatedCards,
                                                    },
                                                  },
                                                },
                                              };
                                            }

                                            return prev;
                                          });
                                        }}
                                      />

                                      <Label
                                        className="bg-black p-3 text-center cursor-pointer rounded-lg text-white"
                                        htmlFor="upload_card"
                                      >
                                        <Input
                                          id="upload_card"
                                          type="file"
                                          className="hidden"
                                          onChange={(e) => {
                                            const files = e.target.files;

                                            if (files && files[0]) {
                                              const file = files[0];

                                              const blob = new Blob([file], {
                                                type: file.type,
                                              });

                                              const blobUrl =
                                                URL.createObjectURL(blob);

                                              setCard((prev) => {
                                                if (prev) {
                                                  console.log("find");
                                                  return {
                                                    ...(prev || {}),
                                                    image: blobUrl,
                                                  };
                                                }

                                                return prev;
                                              });

                                              setLayoutInfo(
                                                (prev: layoutOne) => {
                                                  const findCard =
                                                    prev?.main?.sub_main_section?.sec_1?.cards?.find(
                                                      (item) =>
                                                        item.id === card?.id
                                                    );

                                                  console.log(
                                                    "find",
                                                    findCard,
                                                    card
                                                  );

                                                  if (findCard) {
                                                    const updatedCards =
                                                      prev.main.sub_main_section.sec_1.cards.map(
                                                        (item) =>
                                                          item.id === card?.id
                                                            ? {
                                                                ...item,
                                                                image: blobUrl,
                                                              }
                                                            : item
                                                      );

                                                    return {
                                                      ...prev,
                                                      main: {
                                                        ...prev.main,
                                                        sub_main_section: {
                                                          ...prev.main
                                                            .sub_main_section,
                                                          sec_1: {
                                                            ...prev.main
                                                              .sub_main_section
                                                              .sec_1,
                                                            cards: updatedCards,
                                                          },
                                                        },
                                                      },
                                                    };
                                                  }

                                                  return prev;
                                                }
                                              );
                                            }
                                          }}
                                        />
                                        عوض کردن عکس
                                      </Label>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction>
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Carousel className="w-[80%] h-[50vh] rounded-lg">
                <CarouselContent className="h-[50vh] rounded-lg">
                  {forMain?.main?.sub_main_section?.sec_1?.cards
                    ? forMain.main.sub_main_section.sec_1.cards.map(
                        (item, index) => {
                          return (
                            <CarouselItem key={index} className="h-full">
                              <div className="p-1 h-full">
                                <Card className="h-full bg-transparent border-none">
                                  <CardContent className="flex h-full items-center justify-center p-6 bg-transparent">
                                    <div className="relative w-full overflow-hidden bg-cover bg-[50%] bg-no-repeat">
                                      <img
                                        src={
                                          item.image ||
                                          "https://tecdn.b-cdn.net/img/Photos/Others/mewa.jpg"
                                        }
                                        className="w-full h-[45vh] object-cover rounded-lg"
                                      />
                                      <div
                                        className="absolute bottom-0 left-0 right-0 top-0 h-full w-full rounded-lg overflow-hidden bg-fixed"
                                        style={{
                                          background: "hsla(0, 0%, 0%, 0.6)",
                                        }}
                                      >
                                        <div className="flex h-full items-center justify-center">
                                          <p className="text-white opacity-100">
                                            {item.content}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </CarouselItem>
                          );
                        }
                      )
                    : Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index} className="h-full">
                          <div className="p-1 h-full">
                            <Card className="h-full bg-transparent border-none">
                              <CardContent className="flex h-full items-center justify-center p-6 bg-transparent">
                                <div className="relative w-full overflow-hidden bg-cover bg-[50%] bg-no-repeat">
                                  <img
                                    src="https://tecdn.b-cdn.net/img/Photos/Others/mewa.jpg"
                                    className="w-full h-[45vh] object-cover rounded-lg"
                                  />
                                  <div
                                    className="absolute bottom-0 left-0 right-0 top-0 h-full w-full rounded-lg overflow-hidden bg-fixed"
                                    style={{
                                      background: "hsla(0, 0%, 0%, 0.6)",
                                    }}
                                  >
                                    <div className="flex h-full items-center justify-center">
                                      <p className="text-white opacity-100">
                                        خرید بهتر
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            <div className="w-[45%]">
              <div className="text-center flex items-center justify-center  mb-5 font-bold text-xl">
                <div className="w-[90%]">
                  <p>
                    {forMain?.main?.sub_main_section?.sec_2?.title ||
                      "مزیت های خرید دوره"}
                  </p>
                </div>

                <div className="flex items-center justify-end">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className="text-black">
                        <Edit />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[250px] mr-2">
                      <div>
                        <Input
                          value={
                            forMain?.main?.sub_main_section?.sec_2?.title || ""
                          }
                          placeholder="تایتل"
                          onChange={(e) => {
                            const value = e.target.value;

                            setLayoutInfo((prev: layoutOne) => {
                              if (prev) {
                                return {
                                  ...prev,
                                  main: {
                                    ...prev.main,
                                    sub_main_section: {
                                      ...prev.main.sub_main_section,
                                      sec_2: {
                                        ...prev.main.sub_main_section.sec_2,
                                        title: value,
                                      },
                                    },
                                  },
                                };
                              }

                              return {
                                main: {
                                  sub_main_section: {
                                    sec_2: {
                                      title: value,
                                    },
                                  },
                                },
                              };
                            });
                          }}
                        />
                      </div>

                      <DropdownMenuSeparator />

                      <div className="p-2 grid gap-3">
                        <div className="text-center mb-2">
                          <p>accordion</p>
                        </div>

                        <div>
                          <div className="flex items-center justify-center">
                            <Button
                              onClick={() => {
                                setLayoutInfo((prev: layoutOne) => {
                                  const newAccordionItem = {
                                    title: "welcome",
                                    description: "lorem ipsum",
                                    id: prev?.main?.sub_main_section?.sec_2
                                      ?.accordion?.length
                                      ? prev.main.sub_main_section.sec_2
                                          .accordion.length + 1
                                      : 1,
                                  };

                                  return {
                                    ...prev,
                                    main: {
                                      ...prev?.main,
                                      main_section:
                                        prev?.main?.main_section || {},
                                      sub_main_section: {
                                        ...prev?.main?.sub_main_section,
                                        sec_2: {
                                          ...prev?.main?.sub_main_section
                                            ?.sec_2,
                                          accordion: [
                                            ...(prev?.main?.sub_main_section
                                              ?.sec_2?.accordion || []),
                                            newAccordionItem,
                                          ],
                                        },
                                      },
                                    },
                                  };
                                });
                              }}
                              disabled={
                                forMain?.main?.sub_main_section?.sec_2
                                  ?.accordion?.length === 3
                              }
                            >
                              اضافه کردن accordion
                            </Button>
                          </div>

                          <div>
                            <ScrollArea className="h-[20vh] p-1">
                              {forMain?.main?.sub_main_section?.sec_2?.accordion.map(
                                (item, index) => {
                                  return (
                                    <div key={index}>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <div className="flex items-center justify-center mt-4">
                                            <Button
                                              type="button"
                                              className="p-5 rounded-xl"
                                              variant={"secondary"}
                                              onClick={() => setAccordion(item)}
                                            >
                                              {item.title}
                                            </Button>
                                          </div>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle className="text-start">
                                              ادیت accordion
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-black grid gap-5">
                                              <div>
                                                <Input
                                                  maxLength={25}
                                                  value={accordion?.title || ""}
                                                  onChange={(e) => {
                                                    setLayoutInfo(
                                                      (prev: layoutOne) => {
                                                        if (!prev) return prev; // اگر prev وجود نداشت، به همان صورت بازگردانده می‌شود.

                                                        const findAcc =
                                                          prev.main?.sub_main_section?.sec_2?.accordion?.find(
                                                            (item) =>
                                                              item.id ===
                                                              accordion?.id
                                                          );

                                                        if (findAcc) {
                                                          const updatedAccordion =
                                                            prev.main.sub_main_section.sec_2.accordion.map(
                                                              (item) =>
                                                                item.id ===
                                                                accordion?.id
                                                                  ? {
                                                                      ...item,
                                                                      title:
                                                                        e.target
                                                                          .value, // فقط title به‌روزرسانی می‌شود.
                                                                    }
                                                                  : item
                                                            );

                                                          return {
                                                            ...prev,
                                                            main: {
                                                              ...prev.main,
                                                              sub_main_section:
                                                                {
                                                                  ...prev.main
                                                                    .sub_main_section,
                                                                  sec_2: {
                                                                    ...prev.main
                                                                      .sub_main_section
                                                                      .sec_2,
                                                                    accordion:
                                                                      updatedAccordion, // جایگزینی با accordion به‌روزشده
                                                                  },
                                                                },
                                                            },
                                                          } as layoutOne;
                                                        }

                                                        return prev; // اگر آیتم پیدا نشد، prev به همان صورت بازگردانده می‌شود.
                                                      }
                                                    );

                                                    setAccordion((prev) => {
                                                      if (prev) {
                                                        return {
                                                          ...prev,
                                                          title: e.target.value,
                                                        };
                                                      }

                                                      return prev;
                                                    });
                                                  }}
                                                />
                                              </div>

                                              <div>
                                                <Textarea
                                                  className="resize-none h-[15vh]"
                                                  value={
                                                    accordion?.description || ""
                                                  }
                                                  onChange={(e) => {
                                                    setLayoutInfo(
                                                      (prev: layoutOne) => {
                                                        if (!prev) return prev;

                                                        const findAcc =
                                                          prev.main?.sub_main_section?.sec_2?.accordion?.find(
                                                            (item) =>
                                                              item.id ===
                                                              accordion?.id
                                                          );

                                                        if (findAcc) {
                                                          const updatedAccordion =
                                                            prev.main.sub_main_section.sec_2.accordion.map(
                                                              (item) =>
                                                                item.id ===
                                                                accordion?.id
                                                                  ? {
                                                                      ...item,
                                                                      description:
                                                                        e.target
                                                                          .value,
                                                                    }
                                                                  : item
                                                            );

                                                          return {
                                                            ...prev,
                                                            main: {
                                                              ...prev.main,
                                                              sub_main_section:
                                                                {
                                                                  ...prev.main
                                                                    .sub_main_section,
                                                                  sec_2: {
                                                                    ...prev.main
                                                                      .sub_main_section
                                                                      .sec_2,
                                                                    accordion:
                                                                      updatedAccordion,
                                                                  },
                                                                },
                                                            },
                                                          } as layoutOne;
                                                        }

                                                        return prev;
                                                      }
                                                    );

                                                    setAccordion((prev) => {
                                                      if (prev) {
                                                        return {
                                                          ...prev,
                                                          description:
                                                            e.target.value,
                                                        };
                                                      }

                                                      return prev;
                                                    });
                                                  }}
                                                ></Textarea>
                                              </div>
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                                            <AlertDialogAction>
                                              Continue
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  );
                                }
                              )}
                            </ScrollArea>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Accordion type="multiple" className="w-full">
                  {forMain?.main?.sub_main_section?.sec_2?.accordion ? (
                    forMain.main.sub_main_section.sec_2.accordion.map(
                      (item, index) => {
                        return (
                          <AccordionItem
                            key={index}
                            value={`${item.id}`}
                            dir="rtl"
                          >
                            <AccordionTrigger>{item.title}</AccordionTrigger>
                            <AccordionContent className="text-white/80 whitespace-break-spaces text-wrap">
                              {item.description}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      }
                    )
                  ) : (
                    <>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Is it accessible?</AccordionTrigger>
                        <AccordionContent>
                          Yes. It adheres to the WAI-ARIA design pattern.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Is it styled?</AccordionTrigger>
                        <AccordionContent>
                          Yes. It comes with default styles that matches the
                          other components&apos; aesthetic.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Is it animated?</AccordionTrigger>
                        <AccordionContent>
                          Yes. It's animated by default, but you can disable it
                          if you prefer.
                        </AccordionContent>
                      </AccordionItem>
                    </>
                  )}
                </Accordion>
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-row grid-cols-2 place-items-center w-full">
            {courses.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-gradient-to-tr from-black/20 via-blue-100/10 to-gray-400/20 p-5 rounded-xl"
                >
                  <header className="flex flex-col items-center gap-2 mb-5">
                    <div className="text-3xl font-bold">
                      <p>{item.title}</p>
                    </div>

                    <div>
                      <p className="whitespace-break-spaces">
                        {item.description.slice(0, 150)}
                      </p>
                    </div>

                    <div className="w-full mt-5 flex items-center justify-evenly">
                      <Link href={"#"}>
                        <Button
                          variant={"ghost"}
                          className="rounded-lg hover:bg-black/20 hover:text-white border-2 transition-all duration-150 hover:scale-[1.1]"
                          size={"lg"}
                        >
                          <ArrowUpLeft /> خرید دوره
                        </Button>
                      </Link>

                      <Link href={"#"}>
                        <Button
                          className="rounded-lg text-black transition-all duration-150 hover:scale-[1.1]"
                          variant={"outline"}
                          size={"lg"}
                        >
                          <ArrowLeft /> اطلاعات دوره
                        </Button>
                      </Link>
                    </div>
                  </header>

                  <main>
                    <div className="max-w-[450px]">
                      <img
                        className="rounded-2xl"
                        src={
                          fileUrls.find((file) => file.controllerId === item.id)
                            ?.file || "/Frame 1.jpg"
                        }
                        alt="img"
                      />
                    </div>
                  </main>
                </div>
              );
            })}
          </div>

          <div className="mt-5 border-t-2 w-full text-center">
            <p className="mt-2 mb-2">
              created by <span className="text-blue-200">spotseller.ir</span>
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full fixed w-full left-0 top-0 flex flex-col bg-black">
      <div dir="ltr" className="w-full h-[100vh] flex">
        <main
          id="main"
          className="text-white absolute bottom-0 mt-12 w-full h-full"
          style={{ backgroundColor }}
        >
          <ContextMenu>
            <ContextMenuTrigger className="h-full w-full absolute rounded-md">
              <div className="overflow-auto h-full">
                <div>
                  <header
                    className={`w-full border-b-2 h-[8vh] flex items-center justify-around ${
                      setting.fixed_header
                        ? "fixed right-0 bg-black/40 backdrop-filter backdrop-blur-xl"
                        : ""
                    }`}
                  >
                    <div className="w-[45%]">
                      <div className="font-bold">
                        <Input
                          className="border-none outline-none focus-visible:ring-0 text-lg"
                          maxLength={25}
                          value={setting.header.title}
                          onChange={(e) => {
                            setSetting((prev) => ({
                              ...prev,
                              header: { ...prev.header, title: e.target.value },
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="w-[45%] h-full flex items-center justify-end">
                      <div className="size-14 object-cover flex items-center">
                        <Label
                          htmlFor="header_image"
                          className="cursor-pointer"
                        >
                          <Input
                            id="header_image"
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const fileSelect = e.target.files;

                              if (fileSelect) {
                                const file = fileSelect[0];

                                const blob = new Blob([file], {
                                  type: file.type,
                                });

                                const blobUrl = URL.createObjectURL(blob);

                                setSetting((prev) => ({
                                  ...prev,
                                  header: {
                                    ...prev.header,
                                    image: blobUrl,
                                  },
                                }));
                              }
                            }}
                          />
                          {setting.header.image && (
                            <div>
                              <img src={setting.header.image} alt="Header" />
                            </div>
                          )}
                        </Label>
                      </div>
                    </div>
                  </header>
                </div>

                <div
                  className={`w-full ${
                    setting.fixed_header ? "mt-[75.5px]" : ""
                  }`}
                >
                  {layouts[0].node}
                </div>
              </div>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-64">
              <ContextMenuItem
                inset
                onClick={() => {
                  setNode({ el: layouts[0].node, bgColor: backgroundColor });

                  setLayoutInfo({ ...setting });

                  router.back();
                }}
              >
                بازگشت
                <ContextMenuShortcut>esc</ContextMenuShortcut>
              </ContextMenuItem>

              <ContextMenuSub>
                <ContextMenuSubTrigger inset>طرح بندی ها</ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                  {[
                    {
                      text: "طرح 1",
                      shortcut: "alt+1",
                    },
                  ].map((item, index) => {
                    return (
                      <ContextMenuItem key={index}>
                        {item.text}
                        <ContextMenuShortcut>
                          {item.shortcut}
                        </ContextMenuShortcut>
                      </ContextMenuItem>
                    );
                  })}
                </ContextMenuSubContent>
              </ContextMenuSub>

              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger inset>
                  رنگ پس زمینه
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                  <Input
                    className="rounded-lg"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                  />
                </ContextMenuSubContent>
              </ContextMenuSub>

              <ContextMenuCheckboxItem
                onClick={() =>
                  setSetting((prev) => ({
                    ...prev,
                    fixed_header: !prev.fixed_header,
                  }))
                }
                checked={setting.fixed_header}
              >
                فیکس هدر به بالا
              </ContextMenuCheckboxItem>

              <ContextMenuSeparator />

              <ContextMenuSub>
                <ContextMenuSubTrigger inset>لینک صفحه</ContextMenuSubTrigger>

                <ContextMenuSubContent className="gap-5 grid">
                  <div>
                    <Input
                      maxLength={10}
                      value={setting.link}
                      onChange={(e) =>
                        setSetting((prev) => ({
                          ...prev,
                          link: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      onClick={() =>
                        setSetting((prev) => ({
                          ...prev,
                          link: Enc(
                            user?.userId.toString() || "empty",
                            process.env.NEXT_PUBLIC_ENC_SECRET
                          ).slice(0, 10),
                        }))
                      }
                    >
                      ساخت لینک
                    </Button>

                    <Button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `https://spotseller.ir/_site/${encodeURI(
                            randomBytes(10).toString("hex")
                          )}/${setting.link}`
                        )
                      }
                      size={"sm"}
                    >
                      کپی لینک
                    </Button>
                  </div>
                </ContextMenuSubContent>
              </ContextMenuSub>
            </ContextMenuContent>
          </ContextMenu>
        </main>
      </div>
    </div>
  );
}
