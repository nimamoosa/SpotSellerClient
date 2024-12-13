"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

const chartConfig = {
  telegram_views_count: {
    label: "telegram_views_count",
    color: "hsl(var(--chart-1))",
  },
  transaction_count: {
    label: "transaction_count",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Statistics({
  chartData,
  activeChart,
}: {
  chartData: {
    date: string;
    telegram_views_count: number;
    transaction_count: number;
  }[];
  activeChart: keyof typeof chartConfig;
}) {
  // بررسی وجود حداقل یک مقدار غیرصفر
  const hasNonZeroData = React.useMemo(
    () => chartData.some((data) => data[activeChart] > 0),
    [chartData, activeChart]
  );

  return (
    <Card className="w-full">
      <CardContent className="px-2 sm:p-6">
        {hasNonZeroData ? ( // نمایش نمودار اگر حداقل یک مقدار غیرصفر وجود داشته باشد
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData} // تمام داده‌ها (شامل مقادیر صفر)
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey={chartConfig[activeChart]?.label || activeChart}
                    labelFormatter={(value) => value}
                  />
                }
              />
              <Bar
                dataKey={activeChart}
                fill={chartConfig[activeChart]?.color}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="text-center">No data available</p> // پیام زمانی که همه مقادیر صفر هستند
        )}
      </CardContent>
    </Card>
  );
}
