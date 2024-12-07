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
  // Filter chartData to remove entries where activeChart data is zero or missing
  const filteredChartData = React.useMemo(
    () => chartData.filter((data) => data[activeChart] > 0),
    [chartData, activeChart]
  );

  // Calculate total for statistics
  const total = React.useMemo(
    () =>
      filteredChartData.length > 0
        ? {
            desktop: filteredChartData.reduce(
              (acc, curr) => acc + curr.telegram_views_count,
              0
            ),
            mobile: filteredChartData.reduce(
              (acc, curr) => acc + curr.transaction_count,
              0
            ),
          }
        : null,
    [filteredChartData]
  );

  return (
    <Card className="w-full">
      <CardContent className="px-2 sm:p-6">
        {filteredChartData.length > 0 ? ( // Check if there's data to display
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={filteredChartData}
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
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="text-center">No data available</p> // Message when no data
        )}
      </CardContent>
    </Card>
  );
}
