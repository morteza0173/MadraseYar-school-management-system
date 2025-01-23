"use client";

import { Ellipsis } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "./ui/button";
const chartData = [
  { date: "1403-10-22", desktop: 16.3 },
  { date: "1403-10-23", desktop: 17.2 },
  { date: "1403-10-24", desktop: 15.5 },
  { date: "1403-10-25", desktop: 15.7 },
  { date: "1403-10-26", desktop: 15.6 },
  { date: "1403-10-27", desktop: 14.8 },
  { date: "1403-10-28", desktop: 15.6 },
  { date: "1403-10-29", desktop: 16.7 },
  { date: "1403-10-30", desktop: 17.2 },
  { date: "1403-11-01", desktop: 16.5 },
];

const chartConfig = {
  desktop: {
    label: "نمره",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function LineChartLable() {
  return (
    <Card>
      <CardContent className="h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mt-4">
          <p>میانگین نمرات دانش آموزان</p>
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

              tickFormatter={(value) => value.toFixed(1)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={30}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
