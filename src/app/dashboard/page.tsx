"use client";

import { Statistics } from "@/components/statistics";
import { Card } from "@/components/ui/card";
import { useBot } from "@/contexts/botContext";
import { useBotVisit } from "@/contexts/botVisitContext";
import { useCourse } from "@/contexts/courseContext";
import { useRegisteredUsers } from "@/contexts/registeredUsersContext";
import { useTransaction } from "@/contexts/transactionContext";
import { subtractOneDayFromJalaali, time } from "@/utils/time";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
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

  const { bot, isLoadingBots } = useBot();
  const { botVisits, isLoadingBotVisits } = useBotVisit();
  const { isLoadingTransactions, transactions } = useTransaction();
  const { registeredUsers, isLoadingRegisteredUsers } = useRegisteredUsers();
  const { courses, isLoadingCourse } = useCourse();

  const cards = [
    {
      header: isLoadingTransactions ? "connect...." : transactions?.length,
      description: "تراکنش در این ماه",
      backColor: "bg-[#6611DD]",
      iconBackColor: "bg-[#510EB1]",
      icon: "/cart/cart_1.svg",
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
      icon: "/cart/cart_2.svg",
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
      icon: "/cart/cart_3.svg",
      width: 30,
      height: 31.16,
    },
    {
      header: isLoadingBots ? "connect..." : bot?.setting.status ? "On" : "Off",
      description: "وضعیت اتصال ربات",
      backColor: "bg-[#EE8800]",
      iconBackColor: "bg-[#BE6D05]",
      icon: "/cart/cart_4.svg",
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
              .filter((item) => {
                return item.date.split("/")[2] === String(time.jd + 1);
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
                  transaction.date.split("/")[2] === String(time.jd)
              )
              .reduce((acc, transaction) => acc + transaction.users.length, 0);

            return successfulTransactions > 0 ? successfulTransactions : 0;
          })(),
      rounded_none: "rounded-t-none",
    },
  ];

  useEffect(() => {
    if (!botVisits?.length && !transactions?.length) return;

    const lastTenBotVisits = botVisits.slice(-30);

    const filterBotVisit = lastTenBotVisits.map((botVisit) => {
      const matchingTransaction = transactions.find(
        (transaction) => transaction.date === botVisit.date
      );

      return {
        telegram_views_count: botVisit.users.length,
        transaction_count: matchingTransaction
          ? matchingTransaction.users.length
          : 0,
        date: botVisit.date,
      };
    });

    // Add missing dates if necessary
    while (filterBotVisit.length < 30) {
      // Get the last date in the array
      const lastDate = filterBotVisit[0].date;
      const [jy, jm, jd] = lastDate.split("/").map(Number);

      // Subtract one day from the last date
      const newTime = subtractOneDayFromJalaali({ jy, jm, jd });

      // Format the new date and add it to the beginning of the array
      filterBotVisit.unshift({
        telegram_views_count: 0,
        transaction_count: 0,
        date: `${newTime.jy}/${newTime.jm}/${newTime.jd}`,
      });
    }

    // Set the chart data
    setChartData(filterBotVisit);
  }, [botVisits, transactions]);

  return (
    <Fragment>
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
                  <Image
                    src={item.icon}
                    width={item.width}
                    height={item.height}
                    alt=""
                  />
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
              <button className="flex mt-2 items-center text-[#5B0CCA] transition-all ease-in-out duration-75 hover:text-[#2761D9]">
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
