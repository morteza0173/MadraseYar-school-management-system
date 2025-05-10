"use client";

import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useGetResultData } from "@/hooks/useGetResultData";
// const chartData = [
//   { month: "9 ب", desktop: 16, mobile: 80 },
//   { month: "10 الف", desktop: 15.5, mobile: 200 },
//   { month: "11 الف", desktop: 12, mobile: 120 },
//   { month: "7 ب", desktop: 17, mobile: 190 },
//   { month: "9 الف", desktop: 14.3, mobile: 130 },
//   { month: "10 ب", desktop: 13.7, mobile: 140 },
// ];

export function AvaregeScoreClassChart() {
  const { userData } = useUserAuth(["teacher", "admin"]);
  const { data: resultsData, isPending: isResultsPending } =
    useGetResultData(userData);

  const classScoreMap: Record<string, number[]> = {};

  resultsData?.forEach((item) => {
    const className = item.className;
    if (!classScoreMap[className]) {
      classScoreMap[className] = [];
    }
    classScoreMap[className].push(item.score);
  });

  // ساختن آرایه‌ای از میانگین نمرات هر کلاس
  const classAverages = Object.entries(classScoreMap).map(
    ([className, scores]) => {
      const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return {
        className,
        averageScore: parseFloat(avg.toFixed(2)), // با دو رقم اعشار
      };
    }
  );

  const sortClassAvarege = classAverages.sort(
    (a, b) => b.averageScore - a.averageScore
  ); // نزولی

  const barHeight = 20;
  const gap = 6;
  const chartHeight = classAverages.length * (barHeight + gap);

  const chartConfig = {
    averageScore: {
      label: "میانگین نمرات",
      color: "#60a5fa",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>میانگین نمرات کلاس های شما</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-end">
        {isResultsPending ? (
          <div className="h-20 w-full flex flex-row gap-2 items-center justify-center">
            <Loader2 className="animate-spin" size={16} />
            <p className="text-xs text-center">در حال دریافت اطلاعات کلاس</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className={`w-full`}
            style={{ height: `${chartHeight}px` }}
          >
            <BarChart
              width={300}
              height={chartHeight}
              accessibilityLayer
              data={classAverages}
              layout="vertical"
              margin={{
                right: 60,
              }}
            >
              <CartesianGrid vertical={false} horizontal={false} />
              <YAxis
                dataKey="className"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="averageScore" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="averageScore"
                layout="vertical"
                fill="var(--color-averageScore)"
                barSize={barHeight}
                radius={4}
              >
                <LabelList
                  dataKey="className"
                  position="insideRight"
                  offset={60}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="averageScore"
                  position="right"
                  offset={30}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {sortClassAvarege.length > 0 && (
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex gap-2">
                {" "}
                <p>
                  کلاس{" "}
                  <span className="text-green-500 font-bold">
                    {sortClassAvarege[0].className}
                  </span>{" "}
                  دارای بهترین میانگین نمرات است
                </p>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex gap-2">
                {" "}
                <p>
                  و کلاس{" "}
                  <span className="text-red-500 font-bold">
                    {sortClassAvarege[sortClassAvarege.length - 1].className}
                  </span>{" "}
                  کمترین میانگین نمرات دارد
                </p>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
            </div>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          فقط کلاس هایی که حداقل یک نمره برای آن ثبت شده باشد نمایش داده میشود
        </div>
      </CardFooter>
    </Card>
  );
}
