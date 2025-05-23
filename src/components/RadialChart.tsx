"use client";

import { Ellipsis, Loader2, Users } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "./ui/button";

const chartConfig = {
  boys: {
    label: "پسران",
    color: "#bae6fd",
  },
  grils: {
    label: "دختران",
    color: "#fed7aa",
  },
} satisfies ChartConfig;

interface RadialChartProps {
  maleCount: number;
  femaleCount: number;
  isStudentPending: boolean;
}

export function RadialChart({
  maleCount,
  femaleCount,
  isStudentPending,
}: RadialChartProps) {
  
  const chartData = [{ month: "january", boys: maleCount, grils: femaleCount }];

  return (
    <Card className="flex flex-col border-none ring-0 w-full h-[300px] xl:h-[450px]">
      <CardContent className="h-full flex flex-col justify-between p-0">
        <div className="flex items-center justify-between py-2 p-4">
          <p className="text-sm md:text-base font-bold">دانش آموزان</p>
          <Button
            variant="outline"
            size="icon"
            className="w-6 h-6 bg-transparent border-none shadow-none"
          >
            <Ellipsis className="w-4 h-4" />
          </Button>
        </div>
        {isStudentPending ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin w-4 h-4 " />
            <p className="text-xs text-gray-400">درحال دریافت دانش‌آموزان</p>
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-[250px] h-full"
            >
              <RadialBarChart
                data={chartData}
                endAngle={180}
                innerRadius={80}
                outerRadius={130}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <Users
                            x={(viewBox.cx || 0) - 15}
                            y={(viewBox.cy || 0) - 35}
                            className="w-10 h-10"
                            width={40}
                            height={40}
                          />
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar
                  dataKey="boys"
                  stackId="a"
                  cornerRadius={5}
                  fill="var(--color-boys)"
                  className="stroke-transparent stroke-2"
                />
                <RadialBar
                  dataKey="grils"
                  fill="var(--color-grils)"
                  stackId="a"
                  cornerRadius={5}
                  className="stroke-transparent stroke-2"
                />
              </RadialBarChart>
            </ChartContainer>
            <div className="-mt-24 flex gap-2 items-center justify-between p-4">
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-200" />
                <p className="font-medium ">{maleCount}</p>
                <p className="text-xs">پسران</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-200" />
                <p className="font-medium ">{femaleCount}</p>
                <p className="text-xs">دختران</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
