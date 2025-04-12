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
import { useUserAuth } from "@/hooks/useUserAuth";
import useGetResultData from "@/hooks/useGetResultData";
import { useMemo } from "react";
import { toJalaali } from "jalaali-js";

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
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const { resultsData, isResultsPending } = useGetResultData(userData);

  const { chartData, yDomain } = useMemo(() => {
    if (!resultsData || isResultsPending)
      return { chartData: [], yDomain: [0, 20] };

    const sortedResults = [...resultsData].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    if (sortedResults.length === 0) {
      return { chartData: [], yDomain: [0, 0] };
    }

    const today = new Date();
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(today.getDate() - 10);

    const firstValidDate = new Date(sortedResults[0].createdAt);
    const startDate = firstValidDate > tenDaysAgo ? firstValidDate : tenDaysAgo;

    const dates: string[] = [];
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const jalaaliDate = toJalaali(
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate()
      );
      dates.push(`${jalaaliDate.jy}-${jalaaliDate.jm}-${jalaaliDate.jd}`);
    }

    const filteredResults = sortedResults.filter((result) => {
      const resultDate = new Date(result.createdAt);
      return resultDate >= startDate && resultDate <= today;
    });

    const groupedData = filteredResults.reduce((acc, result) => {
      const date = new Date(result.createdAt);
      const jalaaliDate = toJalaali(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
      const formattedDate = `${jalaaliDate.jy}-${jalaaliDate.jm}-${jalaaliDate.jd}`;
      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(result.score);
      return acc;
    }, {} as Record<string, number[]>);

    const computedChartData: { date: string; result: number }[] = [];
    let cumulativeScore = 0;
    let totalScores = 0;

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];

      if (groupedData[date]) {
        const scores = groupedData[date];
        scores.forEach((score) => {
          cumulativeScore += score;
          totalScores++;
        });
        const average = (cumulativeScore / totalScores).toFixed(2);
        computedChartData.push({ date, result: Number(average) });
      } else {
        const previousResult = (() => {
          for (let j = i - 1; j >= 0; j--) {
            if (computedChartData[j]?.result !== undefined) {
              return computedChartData[j].result;
            }
          }
          return undefined;
        })();

        if (previousResult !== undefined) {
          computedChartData.push({ date, result: previousResult });
        }
      }
    }

    if (computedChartData.length === 0) {
      return { chartData: [], yDomain: [0, 0] };
    }

    const allScores = computedChartData.map((data) => data.result);
    const minScore = Math.min(...allScores);
    const maxScore = Math.max(...allScores);
    const yDomain = [Math.floor(minScore) , Math.ceil(maxScore) ];

    return { chartData: computedChartData, yDomain };
  }, [resultsData, isResultsPending]);

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
              domain={yDomain}
              tick={{ fontSize: 10, fill: "#555" }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="result"
              type="bump"
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
