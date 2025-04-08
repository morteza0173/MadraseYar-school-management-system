"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker/persian";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import "react-day-picker/style.css";
import { useUserAuth } from "@/hooks/useUserAuth";
import useGetEventData from "@/hooks/useGetEventData";
import useGetExamData from "@/hooks/useGetExamData";
import useGetAssignmentData from "@/hooks/useGetAssignmentData";
import jalaali from "jalaali-js";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;
type CombinedDataItem = {
  id: number;
  title: string;
  startTime?: Date;
  dueDate?: Date;
  type: "event" | "exam" | "assignment";
};

const customWeekdays = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
  "شنبه",
];

function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const { eventsData } = useGetEventData(userData);
  const { examsData } = useGetExamData(userData);
  const { assignmentsData } = useGetAssignmentData(userData);

  const combinedData = React.useMemo(() => {
    const allData: CombinedDataItem[] = [
      ...(eventsData?.map((event) => ({
        id: event.id,
        title: event.title,
        startTime: event.startTime,
        type: "event" as const,
      })) || []),
      ...(examsData?.map((exam) => ({
        id: exam.id,
        title: exam.title,
        startTime: exam.startTime,
        type: "exam" as const,
      })) || []),
      ...(assignmentsData?.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        dueDate: assignment.dueDate,
        type: "assignment" as const,
      })) || []),
    ];

    const groupedByDate = allData.reduce(
      (acc: Record<string, CombinedDataItem[]>, item) => {
        const dateKey = new Date(
          item.startTime || item.dueDate!
        ).toDateString();
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
      },
      {}
    );

    return groupedByDate;
  }, [eventsData, examsData, assignmentsData]);

  const disabledDays = (date: Date) => {
    const day = date.getDay();
    return day === 4 || day === 5;
  };
  const modifiers = React.useMemo(() => {
    const daysWithEvents = Object.keys(combinedData).map(
      (date) => new Date(date)
    );

    return {
      friday: (date: Date) => date.getDay() === 4,
      saturday: (date: Date) => date.getDay() === 5,
      hasEvents: (date: Date) =>
        daysWithEvents.some((d) => d.toDateString() === date.toDateString()),
    };
  }, [combinedData]);

  const renderDayContent = (day: Date) => {
    const dateKey = day.toDateString();
    const events = combinedData[dateKey] || [];

    const jalaaliDate = jalaali.toJalaali(day);
    const dayInJalaali = jalaaliDate.jd;

    if (events.length === 0) {
      return <span>{dayInJalaali}</span>;
    }

    const maxDots = 3;
    const eventDots = events.slice(0, maxDots).map((event, index) => {
      const color =
        event.type === "exam"
          ? "bg-blue-500"
          : event.type === "assignment"
          ? "bg-green-500"
          : "bg-red-500";
      return (
        <div
          key={index}
          className={`absolute w-1 h-1 rounded-full ${color}`}
          style={{ top: `${index * 6}px`, left: "0" }}
        ></div>
      );
    });

    return (
      <div className="relative">
        <span>{dayInJalaali}</span>
        <div className="absolute -top-1 -right-2 flex flex-col items-center">
          {eventDots}
          {events.length > maxDots && (
            <span className="absolute text-xs text-gray-500 top-4">
              +{events.length - maxDots}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <DayPicker
      dir="rtl"
      today={new Date()}
      formatters={{
        // @ts-expect-error formatDay need string for output but not working
        formatDay: renderDayContent as (date: Date) => React.JSX.Element,
        formatWeekdayName(date) {
          return customWeekdays[date.getDay()];
        },
      }}
      disabled={disabledDays}
      modifiers={modifiers}
      modifiersClassNames={{
        friday: "text-red-500",
        saturday: "text-red-500",
        hasEvents: "relative",
      }}
      showOutsideDays={showOutsideDays}
      className={cn("p-2 font-IranSans w-full", className)}
      classNames={{
        hidden: "invisible",
        root: " w-full bg-card rounded-xl shadow-sm p-2 md:h-[380px] lg:h-auto",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        weekdays: "text-muted-foreground",
        weekday: "px-1 text-center text-[0.6rem] font-semibold",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-full p-0 hover:bg-orange-100 aspect-square"
        ),
        day: "",
        selected:
          "bg-orange-300 rounded-md text-primary-foreground hover:text-primary-foreground ",
        today: "bg-orange-200 rounded-md text-accent-foreground",

        month_caption: "font-bold mt-2 mb-3",
        month: "space-y-4  w-full",
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav: "flex flex-row-reverse gap-x-1 absolute left-0.5 top-1 fill-foreground",
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft />;
          } else {
            return <ChevronRight />;
          }
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
