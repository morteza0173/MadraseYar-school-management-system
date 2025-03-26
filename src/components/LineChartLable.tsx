"use client";

import { Ellipsis } from "lucide-react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
const chartData = [
  { date: "1403-10-22", result: 16.3 },
  { date: "1403-10-23", result: 17.2 },
  { date: "1403-10-24", result: 15.5 },
  { date: "1403-10-25", result: 15.7 },
  { date: "1403-10-26", result: 15.6 },
  { date: "1403-10-27", result: 14.8 },
  { date: "1403-10-28", result: 15.6 },
  { date: "1403-10-29", result: 16.7 },
  { date: "1403-10-30", result: 17.2 },
  { date: "1403-11-01", result: 16.5 },
];

const chartConfig = {
  result: {
    label: "نمره",
    color: "#fb923c ",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function LineChartLable() {
  const isMobile = useIsMobile();
  const lineStroke = isMobile ? 0.5 : 2;
  const fontSize = isMobile ? 10 : 12;
  return (
    <Card>
      <CardContent className="h-full flex flex-col justify-between">
        <div className="flex items-center justify-between font-bold my-4">
          <p className="text-sm md:text-base">میانگین نمرات دانش آموزان</p>
          <Button
            variant="outline"
            size="icon"
            className="w-6 h-6 bg-transparent border-none shadow-none"
          >
            <Ellipsis className="w-4 h-4" />
          </Button>
        </div>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 0,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 10, fill: "#555" }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en", {
                  month: "numeric",
                  day: "numeric",
                });
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={50}
              domain={[14, 18]}
              tick={{ fontSize: 10, fill: "#555" }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="result"
              type="natural"
              stroke="var(--color-result)"
              strokeWidth={lineStroke}
              dot={{
                fill: "var(--color-result)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={30}
                className="fill-foreground"
                fontSize={fontSize}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
