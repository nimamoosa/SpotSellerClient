"use client";

import { Statistics } from "@/components/statistics";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { useBot } from "@/contexts/botContext";
import { useBotVisit } from "@/contexts/botVisitContext";
import { useCourse } from "@/contexts/courseContext";
import { useRegisteredUsers } from "@/contexts/registeredUsersContext";
import { useTransaction } from "@/contexts/transactionContext";
import { subtractOneDayFromJalaali, time } from "@/utils/time";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

export default function Dashboard() {
  const [cardSelect, setCardSelect] = useState(0);
  const [chartData, setChartData] = useState<
    {
      date: string;
      telegram_views_count: number;
      transaction_count: number;
    }[]
  >([]);
  const [open, setOpen] = useState(false);

  const { bot, isLoadingBots } = useBot();
  const { botVisits, isLoadingBotVisits } = useBotVisit();
  const { isLoadingTransactions, transactions } = useTransaction();
  const { registeredUsers, isLoadingRegisteredUsers } = useRegisteredUsers();
  const { courses, isLoadingCourse } = useCourse();

  const cards = [
    {
      header: isLoadingTransactions
        ? "connect...."
        : transactions?.find(
            (item) => item.date.split("/")[1] === time.jm.toString()
          )?.users.length || 0,
      description: "تراکنش در این ماه",
      backColor: "bg-[#6611DD]",
      iconBackColor: "bg-[#510EB1]",
      icon: (
        <>
          <svg
            width="40"
            height="36"
            viewBox="0 0 40 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_65_600)">
              <path
                d="M13.5726 27.0619H33.0551C33.7062 27.0619 34.2738 26.5276 34.2738 25.8098C34.2738 25.0918 33.7062 24.5576 33.0551 24.5576H13.8565C12.9049 24.5576 12.3206 23.8898 12.1703 22.8715L9.43241 4.2905C9.26545 3.00501 8.798 2.35393 7.09517 2.35393H1.23539C0.567613 2.35393 0 2.93824 0 3.60603C0 4.2905 0.567613 4.8748 1.23539 4.8748H6.87815L9.54927 23.2054C9.89986 25.5759 11.1519 27.0619 13.5726 27.0619ZM10.5009 21.1185H33.0886C35.5258 21.1185 36.7781 19.6161 37.1287 17.2287L38.4642 8.39735C38.4975 8.18033 38.531 7.91321 38.531 7.76296C38.531 6.96163 37.9299 6.4107 37.0118 6.4107H9.04843L9.06512 8.93157H35.6929L34.5075 16.9282C34.374 17.9633 33.8232 18.6144 32.8381 18.6144H10.4675L10.5009 21.1185ZM14.8915 35.1754C16.394 35.1754 17.5961 33.99 17.5961 32.4708C17.5961 30.9683 16.394 29.7663 14.8915 29.7663C13.3723 29.7663 12.1703 30.9683 12.1703 32.4708C12.1703 33.99 13.3723 35.1754 14.8915 35.1754ZM30.5009 35.1754C32.0201 35.1754 33.2221 33.99 33.2221 32.4708C33.2221 30.9683 32.0201 29.7663 30.5009 29.7663C28.9984 29.7663 27.7797 30.9683 27.7797 32.4708C27.7797 33.99 28.9984 35.1754 30.5009 35.1754Z"
                fill="white"
                fillOpacity="0.85"
              />
            </g>
            <defs>
              <clipPath id="clip0_65_600">
                <rect width="40" height="35.1754" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </>
      ),
      width: 40,
      height: 35.18,
    },
    {
      header: isLoadingCourse
        ? "connect...."
        : courses?.map((item) => item.active === true)?.length || 0,
      description: "دوره های فعال",
      backColor: "bg-[#DD0077]",
      iconBackColor: "bg-[#B1055F]",
      icon: (
        <>
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_150_43)">
              <path
                d="M5.42078 30C6.12707 30 6.72742 29.7169 7.43373 29.3098L28.0222 17.3806C29.4879 16.5133 29.9999 15.9469 29.9999 15.0089C29.9999 14.0708 29.4879 13.5045 28.0222 12.6549L7.43373 0.707968C6.72742 0.300888 6.12707 0.0354004 5.42078 0.0354004C4.11412 0.0354004 3.30188 1.02655 3.30188 2.56639V27.4514C3.30188 28.9912 4.11412 30 5.42078 30ZM6.3213 26.6195C6.21536 26.6195 6.14474 26.5487 6.14474 26.4071V3.61063C6.14474 3.46903 6.21536 3.39824 6.3213 3.39824C6.39194 3.39824 6.46257 3.43364 6.53319 3.48674L26.0799 14.8142C26.1683 14.8673 26.2389 14.9204 26.2389 15.0089C26.2389 15.0974 26.1683 15.1682 26.0799 15.2036L6.53319 26.5487C6.46257 26.5842 6.39194 26.6195 6.3213 26.6195Z"
                fill="white"
                fillOpacity="0.85"
              />
            </g>
            <defs>
              <clipPath id="clip0_150_43">
                <rect width="30" height="30" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </>
      ),
      width: 30,
      height: 30,
    },
    {
      header: isLoadingRegisteredUsers
        ? "connect..."
        : registeredUsers?.length || 0,
      description: "کاربران ثبت نام شده",
      backColor: "bg-[#66BB00]",
      iconBackColor: "bg-[#519506]",
      icon: (
        <>
          <svg
            width="30"
            height="32"
            viewBox="0 0 30 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_150_52)">
              <path
                d="M4.11995 31.1434H25.2579C28.0494 31.1434 29.3777 30.3027 29.3777 28.4528C29.3777 24.047 23.8116 17.6738 14.6973 17.6738C5.56613 17.6738 0 24.047 0 28.4528C0 30.3027 1.32847 31.1434 4.11995 31.1434ZM3.32959 28.6042C2.89238 28.6042 2.7074 28.4866 2.7074 28.1334C2.7074 25.3588 6.97868 20.213 14.6973 20.213C22.399 20.213 26.6704 25.3588 26.6704 28.1334C26.6704 28.4866 26.5022 28.6042 26.065 28.6042H3.32959ZM14.6973 15.5717C18.6996 15.5717 21.9618 12.0235 21.9618 7.68497C21.9618 3.38004 18.7163 0 14.6973 0C10.7119 0 7.43273 3.4473 7.43273 7.7186C7.43273 12.0403 10.6951 15.5717 14.6973 15.5717ZM14.6973 13.0325C12.2421 13.0325 10.1401 10.6951 10.1401 7.7186C10.1401 4.79259 12.2085 2.53924 14.6973 2.53924C17.2029 2.53924 19.2544 4.74215 19.2544 7.68497C19.2544 10.6614 17.1693 13.0325 14.6973 13.0325Z"
                fill="white"
                fillOpacity="0.85"
              />
            </g>
            <defs>
              <clipPath id="clip0_150_52">
                <rect width="30" height="31.1603" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </>
      ),
      width: 30,
      height: 31.16,
    },
    {
      header: isLoadingBots
        ? "connect..."
        : bot?.settings.status
        ? "On"
        : "Off",
      description: "وضعیت اتصال ربات",
      backColor: "bg-[#EE8800]",
      iconBackColor: "bg-[#BE6D05]",
      icon: (
        <>
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_150_61)">
              <path
                d="M37.3231 19.4811C37.3231 29.5939 28.8706 38 18.6615 38C8.47087 38 0 29.5939 0 19.4811C0 9.3502 8.45258 0.96225 18.6432 0.96225C28.8522 0.96225 37.3231 9.3502 37.3231 19.4811ZM25.6139 9.69514L7.48291 16.5943C6.60472 16.903 5.92778 17.4476 5.92778 18.2102C5.92778 19.1542 6.64131 19.481 7.66587 19.7897L13.3741 21.4964C14.051 21.696 14.4169 21.696 14.8743 21.2967L26.4006 10.5666C26.5469 10.4395 26.6932 10.4759 26.803 10.5485C26.9312 10.6574 26.9312 10.8208 26.803 10.9661L16.0636 22.4587C15.6428 22.8762 15.6062 23.2211 15.7891 23.9475L17.4906 29.4485C17.8199 30.5015 18.1127 31.2641 19.0822 31.2641C19.8507 31.2641 20.3997 30.6469 20.7839 29.6483L27.6813 11.7467C27.8641 11.2565 27.9558 10.8571 27.9558 10.494C27.9558 9.82223 27.5532 9.40465 26.8763 9.40465C26.5104 9.40465 26.1078 9.5136 25.6139 9.69514Z"
                fill="white"
                fillOpacity="0.85"
              />
            </g>
            <defs>
              <clipPath id="clip0_150_61">
                <rect width="38" height="38" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </>
      ),
      width: 38,
      height: 38,
    },
  ];

  const mainCard = [
    {
      title: "تعداد بازدید های امروز در بات تلگرام",
      description: isLoadingBotVisits
        ? "connect..."
        : (() => {
            const todaysVisits = botVisits
              ?.filter((item) => {
                return item.date.split("/")[2] === String(time.jd);
              })
              .reduce((acc, item) => {
                return acc + item.users.length;
              }, 0);

            return todaysVisits > 0 ? todaysVisits : 0;
          })(),
      rounded_none: "rounded-b-none",
    },
    {
      title: "تعداد تراکنش های موفق امروز",
      description: isLoadingTransactions
        ? "connect..."
        : (() => {
            const successfulTransactions = transactions
              .filter(
                (transaction) =>
                  transaction.date.split("/")[2] === String(time.jd) &&
                  transaction.users.some((user) => user.type === "success") // بررسی درون users
              )
              .reduce((acc, transaction) => acc + transaction.users.length, 0);

            return successfulTransactions > 0 ? successfulTransactions : 0;
          })(),
      rounded_none: "rounded-t-none",
    },
  ];

  useEffect(() => {
    if (!botVisits?.length && !transactions?.length) return;

    const lastTenBotVisits = botVisits?.slice(-30) || [];

    const allDates = new Set(
      [
        ...transactions.map((transaction) => transaction?.date),
        ...lastTenBotVisits.map((botVisit) => botVisit?.date),
      ].filter(Boolean)
    );

    const filterBotVisit = Array.from(allDates)
      .map((date) => {
        const matchingBotVisit = lastTenBotVisits.find(
          (botVisit) => botVisit?.date === date
        );

        const matchingTransaction = transactions.find(
          (transaction) =>
            transaction?.date === date &&
            transaction?.users?.some((user) => user?.type === "success")
        );

        return {
          telegram_views_count: matchingBotVisit?.users?.length || 0,
          transaction_count:
            matchingTransaction?.users?.filter(
              (user) => user?.type === "success"
            ).length || 0,
          date,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    while (filterBotVisit.length < 30) {
      const lastDate = filterBotVisit[0]?.date;

      if (!lastDate) break;

      const [jy, jm, jd] = lastDate.split("/").map(Number);

      const newTime = subtractOneDayFromJalaali({ jy, jm, jd });

      filterBotVisit.unshift({
        telegram_views_count: 0,
        transaction_count: 0,
        date: `${newTime.jy}/${newTime.jm}/${newTime.jd}`,
      });
    }

    setChartData(filterBotVisit);
  }, [botVisits, transactions]);

  return (
    <Fragment>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              suppressHydrationWarning
              className="flex items-center justify-start"
            >
              شماره پشتیبانی
            </AlertDialogTitle>
            <AlertDialogDescription
              suppressHydrationWarning
              className="flex items-center justify-start"
            >
              +989131695571
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>بستن</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="flex justify-between w-full">
        {cards.map((item, index) => {
          return (
            <Card
              className={`w-[250px] h-[124px] flex items-center justify-center ${item.backColor}`}
              key={index}
            >
              <section className="w-[60%] h-full flex items-center justify-center">
                <div className="mr-2 -space-y-[10px] mt-3">
                  <div className="text-white text-[34px]">
                    <span>{item.header}</span>
                  </div>
                  <div className="text-white/[63%] text-[16.5px]">
                    <span>{item.description}</span>
                  </div>
                </div>
              </section>

              <section className="w-[40%] h-full flex items-start justify-end">
                <div
                  className={`w-[78px] h-[76px] rounded-tl-[10px] rounded-br-[19px] flex items-center justify-center ${item.iconBackColor}`}
                >
                  {item.icon}
                </div>
              </section>
            </Card>
          );
        })}
      </header>

      <main>
        <section className="w-full flex justify-center">
          <div className="w-full h-[70px] mt-5 rounded-lg flex items-center bg-[#EDEDED]">
            <span className="mr-7 text-[20px] font-medium">
              گزارشات ماه اخیر
            </span>
          </div>
        </section>

        <section className="mt-3 flex gap-5 ml-auto mr-auto w-full">
          <div>
            <div className="w-[461px] h-[265px] border-[1px] rounded-[10px] border-[#D3D3D3]">
              {mainCard.map((item, index) => {
                return (
                  <div
                    className={`w-full h-[50%] rounded-[10px] cursor-pointer ${
                      item.rounded_none
                    } pr-9 flex flex-row items-center border-b-[1px] ${
                      cardSelect === index ? "bg-[#2761D9]/[7%]" : "bg-white"
                    }`}
                    key={index}
                    onClick={() => setCardSelect(index)}
                  >
                    <div className="w-[90%] mt-4 mr-5">
                      <div>
                        <span>{item.title}</span>
                      </div>
                      <div>
                        <span className="text-[40px]">{item.description}</span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {cardSelect === index && (
                        <motion.div
                          className="w-[10%] h-full flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="w-full h-full flex items-center justify-end">
                            <div className="bg-[#2761D9] w-[15px] h-[109px] rounded-tr-2xl rounded-br-lg" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="p-2">
              <button
                className="flex mt-2 items-center text-[#5B0CCA] transition-all ease-in-out duration-75 hover:text-[#2761D9]"
                onClick={() => setOpen(true)}
              >
                تماس با پشتیبانی اسپات سلر <ArrowLeft />
              </button>
            </div>
          </div>

          <div className="w-full">
            {chartData.length >= 1 ? (
              <Statistics
                chartData={chartData}
                activeChart={
                  cardSelect === 0
                    ? "telegram_views_count"
                    : "transaction_count"
                }
              />
            ) : (
              <div className="flex items-center justify-center h-full text-3xl">
                <p>چیزی پیدا نشد</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </Fragment>
  );
}
