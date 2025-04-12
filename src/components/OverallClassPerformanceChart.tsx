"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "./ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserAuth } from "@/hooks/useUserAuth";
import useGetResultData from "@/hooks/useGetResultData";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import { Button } from "./ui/button";
import { AlertTriangle, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { cn } from "@/lib/utils";

export function OverallClassPerformanceChart() {
  const mobile = useIsMobile();
  const { userData } = useUserAuth(["teacher", "admin"]);
  const { resultsData, isResultsPending } = useGetResultData(userData);
  const uniqueClasses = Array.from(
    new Set(resultsData?.map((item) => item.className))
  );
  const [classValue, setClassValue] = useState<string | null>(null);
  const filtredClass = classValue
    ? resultsData?.filter((result) => result.className === classValue)
    : resultsData;

  const [openClassList, setOpenClassList] = useState(false);

  const innerRadius = mobile ? 30 : 60;

  const scoreStats = {
    top: 0, // 18 تا 20
    good: 0, // 16 تا 17.99
    medium: 0, // 12 تا 15.99
    low: 0, // 0 تا 11.99
  };

  const studentScoresMap: Record<string, number[]> = {};

  // ۱. گروه‌بندی نمرات بر اساس ID دانش‌آموز
  filtredClass?.forEach(({ student, score }) => {
    const id = student.id;
    if (!studentScoresMap[id]) {
      studentScoresMap[id] = [];
    }
    studentScoresMap[id].push(score);
  });

  // ۲. محاسبه میانگین و ۳. گروه‌بندی
  Object.entries(studentScoresMap).forEach(([, scores]) => {
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;

    if (avg >= 18 && avg <= 20) {
      scoreStats.top++;
    } else if (avg >= 16 && avg < 18) {
      scoreStats.good++;
    } else if (avg >= 12 && avg < 16) {
      scoreStats.medium++;
    } else {
      scoreStats.low++;
    }
  });

  const studentNameMap: Record<string, string> = {};
  filtredClass?.forEach(({ student }) => {
    studentNameMap[student.id] = student.name;
  });

  // محاسبه میانگین نمره و ساختن آرایه دانش‌آموزان با میانگین
  const studentAvgList = Object.entries(studentScoresMap).map(
    ([id, scores]) => {
      const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      return {
        id,
        name: studentNameMap[id] || "نامشخص",
        avgScore,
      };
    }
  );

  // مرتب‌سازی بر اساس میانگین نمره و گرفتن ۵ دانش‌آموز اول
  const top5Students = studentAvgList
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);

  const chartData = [
    { browser: "top", visitors: scoreStats.top, fill: "var(--color-top)" },
    {
      browser: "good",
      visitors: scoreStats.good,
      fill: "var(--color-good)",
    },
    {
      browser: "medium",
      visitors: scoreStats.medium,
      fill: "var(--color-medium)",
    },
    { browser: "low", visitors: scoreStats.low, fill: "var(--color-low)" },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    top: {
      label: "نمره 18 تا 20",
      color: "#a855f7",
    },
    good: {
      label: "نمره 16 تا 17.99",
      color: "#60a5fa",
    },
    medium: {
      label: "نمره 12 تا 15.99",
      color: "#16a34a",
    },
    low: {
      label: "نمره 0 تا 11.99",
      color: "#f87171",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <div className="flex justify-between items-center p-2">
        <h2 className="font-bold text-sm md:text-base">عملکرد کلی کلاس</h2>
        <Popover modal open={openClassList} onOpenChange={setOpenClassList}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openClassList}
              className="md:w-[250px] justify-between "
            >
              {classValue
                ? (() => {
                    const selectedClass = resultsData?.find(
                      (result) => result.className === classValue
                    );
                    return selectedClass
                      ? `${selectedClass.className}`
                      : "همه کلاس ها";
                  })()
                : "همه کلاس ها"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0 ">
            <Command>
              <CommandList>
                <CommandGroup>
                  <CommandItem disabled>
                    <p className="text-xs font-semibold text-center p-2">
                      کلاس‌هایی که نمره ندارند مشاهده نمیشوند
                    </p>
                  </CommandItem>
                  <CommandItem
                    value={undefined}
                    onSelect={() => {
                      setClassValue(null);
                      setOpenClassList(false);
                    }}
                  >
                    همه کلاس ها
                    <Check
                      className={cn(
                        "ml-auto",
                        classValue === null ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                  {isResultsPending && (
                    <div className="flex gap-2 justify-center items-center mt-2">
                      <Loader2 className="animate-spin" size={16} />
                      <p className="text-xs">درحال دریافت کلاس ها</p>
                    </div>
                  )}
                  {uniqueClasses?.map((result) => (
                    <CommandItem
                      key={result}
                      className="z-[60] pointer-events-auto overflow-auto"
                      value={String(result)}
                      onSelect={(currentValue) => {
                        const selectedValue =
                          currentValue === String(classValue)
                            ? ""
                            : currentValue;
                        setClassValue(selectedValue);
                        setOpenClassList(false);
                      }}
                    >
                      {`${result}`}
                      <Check
                        className={cn(
                          "ml-auto",
                          classValue === result ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <CardContent className="flex flex-col md:flex-row justify-between items-center pb-0">
        {isResultsPending ? (
          <div className="h-40 w-full flex flex-row gap-2 items-center justify-center">
            <Loader2 className="animate-spin" size={16} />
            <p className="text-xs text-center">در حال دریافت اطلاعات کلاس</p>
          </div>
        ) : filtredClass?.length === 0 ? (
          <div className="h-40 w-full flex flex-row gap-2 items-center justify-center">
            <AlertTriangle className="animate-spin" size={16} />
            <p className="text-xs text-center">نمره ای ثبت نشده</p>
          </div>
        ) : (
          <>
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="flex gap-4 justify-around">
                <div className="flex flex-col gap-4 items-center">
                  <div className="felx flex-col">
                    <Badge className="bg-purple-500">نمره 18 تا 20</Badge>
                    <p className="text-center text-xs font-bold mt-2">
                      {scoreStats.top} نفر
                    </p>
                  </div>
                  <div className="felx flex-col">
                    <Badge className="bg-green-600">نمره 12 تا 16</Badge>
                    <p className="text-center text-xs font-bold mt-2">
                      {scoreStats.medium} نفر
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 items-center">
                  <div className="felx flex-col">
                    <Badge className="bg-blue-400">نمره 16 تا 18</Badge>
                    <p className="text-center text-xs font-bold mt-2">
                      {scoreStats.good} نفر
                    </p>
                  </div>
                  <div className="felx flex-col">
                    <Badge className="bg-red-400">نمره 0 تا 12</Badge>
                    <p className="text-center text-xs font-bold mt-2">
                      {scoreStats.low} نفر
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">پنج دانش‌آموز برتر</p>
                {top5Students.length === 0 && (
                  <p className="text-sm">دانش آموزی وجود ندارد</p>
                )}
                <div className="flex flex-wrap justify-center gap-4 p-1">
                  {top5Students.map((student, index) => (
                    <div
                      key={student.id}
                      className="flex flex-col gap-1 items-center"
                    >
                      <p>
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : "🏅"}
                      </p>
                      <p className="text-center text-xs font-bold">
                        {student.name}
                      </p>
                      <p className="text-center text-xs font-bold">
                        {student.avgScore.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ChartContainer
              config={chartConfig}
              className="md:mr-auto w-1/2 aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="visitors"
                  nameKey="browser"
                  innerRadius={innerRadius}
                />
              </PieChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
