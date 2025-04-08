"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker/persian";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const customWeekdays = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
  "شنبه",
];

function CalendarNoEvent({
  className,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const disabledDays = (date: Date) => {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
    return day === 4 || day === 5; // پنج‌شنبه (5) و جمعه (6)
  };
  const modifiers = {
    friday: (date: Date) => date.getDay() === 4, // پنج‌شنبه
    saturday: (date: Date) => date.getDay() === 5, // جمعه
  };
  // const events = [new Date(2025, 0, 25), new Date(2025, 0, 30)];
  // const announcements = [new Date(2025, 0, 25), new Date(2025, 0, 31)]; // اعلامیه‌ها

  return (
    <DayPicker
      dir="rtl"
      today={new Date()}
      formatters={{
        formatWeekdayName(date) {
          return customWeekdays[date.getDay()];
        },
      }}
      // modifiers={{
      //   eventDays: events,
      //   announcementDays: announcements,
      //   both: events.filter((event) =>
      //     announcements.some(
      //       (announcement) => event.getTime() === announcement.getTime()
      //     )
      //   ),
      // }}
      // modifiersStyles={{
      //   eventDays: { border: "2px solid red" },
      //   announcementDays: { border: "2px solid blue" }, // استایل اعلامیه‌ها
      //   both: { position: "relative" }, // اگر هم اونت و هم اعلامیه باشد
      // }}
      // modifiersClassNames={{
      //   both: "half-border",
      // }}
      disabled={disabledDays}
      modifiers={modifiers}
      modifiersClassNames={{
        friday: "text-red-500", // تغییر رنگ پنج‌شنبه
        saturday: "text-red-500", // تغییر رنگ جمعه
      }}
      showOutsideDays={showOutsideDays}
      className={cn("p-2 font-IranSans w-full", className)}
      classNames={{
        hidden: "invisible",
        root: " w-full bg-card rounded-xl shadow-sm p-2 md:h-[380px] lg:h-auto",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        weekdays: "text-muted-foreground",
        weekday: "px-1 text-center text-xs font-semibold",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-full p-0 hover:bg-orange-100"
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
CalendarNoEvent.displayName = "Calendar";

export { CalendarNoEvent };
