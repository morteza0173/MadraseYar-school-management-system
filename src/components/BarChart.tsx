"use client";

import { Bar, BarChart, XAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
const chartData = [
  { date: "1403-10-22", running: 2400, swimming: 100 },
  { date: "1403-10-23", running: 2480, swimming: 20 },
  { date: "1403-10-24", running: 2499, swimming: 1 },
  { date: "1403-10-25", running: 2380, swimming: 120 },
  { date: "1403-10-26", running: 2430, swimming: 70 },
  { date: "1403-10-29", running: 2250, swimming: 250 },
];

const chartConfig = {
  running: {
    label: "حاضرین",
    color: "#C3EBFA",
  },
  swimming: {
    label: "غایبین",
    color: "#FAE27C",
  },
} satisfies ChartConfig;

export function Barchart() {
  return (
    <Card className="border-none ring-0 h-[400px] xl:h-[450px]">
      <CardContent className="h-full flex flex-col justify-between p-0">
        <div className="flex items-center justify-between py-2 p-4">
          <p>حضور و غیاب</p>
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-[80px]" dir="rtl">
                <SelectValue defaultValue="هفته" placeholder="هفته" />
              </SelectTrigger>
              <SelectContent className="w-[80px]" dir="rtl">
                <SelectItem value="هفته">هفته</SelectItem>
                <SelectItem value="ماهانه">ماهانه</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[120px]" dir="rtl">
                <SelectValue
                  defaultValue="همه کلاس ها"
                  placeholder="همه کلاس ها"
                />
              </SelectTrigger>
              <SelectContent className="w-[120px]" dir="rtl">
                <SelectItem value="همه کلاس ها">همه کلاس ها</SelectItem>
                <SelectItem value="کلاس 1">کلاس 1</SelectItem>
                <SelectItem value="کلاس 2">کلاس 2</SelectItem>
                <SelectItem value="کلاس 3">کلاس 3</SelectItem>
                <SelectItem value="کلاس 4">کلاس 4</SelectItem>
                <SelectItem value="کلاس 5">کلاس 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2 items-center px-4">
          <div className="h-3 w-3 bg-Sky rounded-full" />
          <p className="text-xs text-gray-700">حاضرین</p>
          <div className="h-3 w-3 bg-Yellow rounded-full mr-4" />
          <p className="text-xs text-gray-700">غایبین</p>
        </div>
        <ChartContainer config={chartConfig} className="h-[80%]">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("fa", {
                  weekday: "short",
                });
              }}
            />
            <Bar
              dataKey="running"
              stackId="a"
              fill="var(--color-running)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="swimming"
              stackId="a"
              fill="var(--color-swimming)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
