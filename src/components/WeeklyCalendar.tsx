"use client";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import faLocale from "@fullcalendar/core/locales/fa";
import rrulePlugin from "@fullcalendar/rrule";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";


const events = [
  {
    title: "شیمی1",
    duration: "01:15",
    color: "#fda4af",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["sa"], // Correct the lowercase day names
      dtstart: "2025-01-01T08:00:00",
      until: "2025-06-01",
    },
  },
  {
    title: "هندسه1",
    duration: "01:15",
    color: "#0ea5e9",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["sa"], // Correct the lowercase day names
      dtstart: "2025-01-01T09:30:00",
      until: "2025-06-01",
    },
  },
  {
    title: "فیزیک1",
    duration: "01:15",
    color: "#fda4af",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["sa", "tu"], // Correct the lowercase day names
      dtstart: "2025-01-01T11:00:00",
      until: "2025-06-01",
    },
  },
  {
    title: "تربیت بدنی",
    duration: "01:15",
    color: "#0ea5e9",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["sa"], // Correct the lowercase day names
      dtstart: "2025-01-01T12:30:00",
      until: "2025-06-01",
    },
  },
  {
    title: "تعلیمات دینی",
    duration: "01:15",
    color: "#0ea5e9",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["su"], // Correct the lowercase day names
      dtstart: "2025-01-01T08:00:00",
      until: "2025-06-01",
    },
  },
  {
    title: "نگارش1",
    duration: "01:15",
    color: "#fda4af",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["su"], // Correct the lowercase day names
      dtstart: "2025-01-01T09:30:00",
      until: "2025-06-01",
    },
  },
  {
    title: "ریاضی1",
    duration: "01:15",
    color: "#0ea5e9",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["su", "mo"], // Correct the lowercase day names
      dtstart: "2025-01-01T11:00:00",
      until: "2025-06-01",
    },
  },
  {
    title: "فارسی1",
    duration: "01:15",
    color: "#0ea5e9",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["su"], // Correct the lowercase day names
      dtstart: "2025-01-01T12:30:00",
      until: "2025-06-01",
    },
  },
  {
    title: "علوم تجربی 1",
    duration: "01:15",
    color: "#0ea5e9",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["mo"], // Correct the lowercase day names
      dtstart: "2025-01-01T08:00:00",
      until: "2025-06-01",
    },
  },
  {
    title: "زبان خارجه1",
    duration: "01:15",
    color: "#fda4af",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["mo"], // Correct the lowercase day names
      dtstart: "2025-01-01T09:30:00",
      until: "2025-06-01",
    },
  },
  {
    title: "شیمی1",
    duration: "00:35",
    color: "#0ea5e9",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["mo"], // Correct the lowercase day names
      dtstart: "2025-01-01T12:30:00",
      until: "2025-06-01",
    },
  },
  {
    title: "فارسی1",
    duration: "01:15",
    color: "#0ea5e9",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["tu"], // Correct the lowercase day names
      dtstart: "2025-01-01T08:00:00",
      until: "2025-06-01",
    },
  },
  {
    title: "عربی1",
    duration: "01:15",
    color: "#fda4af",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["tu"], // Correct the lowercase day names
      dtstart: "2025-01-01T09:30:00",
      until: "2025-06-01",
    },
  },
  {
    title: "زمین شناسی",
    duration: "01:15",
    color: "#0ea5e9",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["we"], // Correct the lowercase day names
      dtstart: "2025-01-01T08:00:00",
      until: "2025-06-01",
    },
  },
  {
    title: "دفاعی",
    duration: "01:15",
    color: "#fda4af",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["we"], // Correct the lowercase day names
      dtstart: "2025-01-01T09:30:00",
      until: "2025-06-01",
    },
  },
  {
    title: "زبان خارجه",
    duration: "01:15",
    color: "#fda4af",
    rrule: {
      freq: "weekly",
      interval: 1,
      byweekday: ["we"], // Correct the lowercase day names
      dtstart: "2025-01-01T11:00:00",
      until: "2025-06-01",
    },
  },
];



export default function WeeklyCalendar() {
  return (
    <Card>
      <CardContent className="p-0 md:p-2 lg:p-4">
        <div className="flex justify-between m-4 md:m-2 lg:m-0 md:mb-2 lg:mb-4">
          <h2 className="">برنامه هفتگی</h2>
          <Button disabled variant="outline">
            <p className="text-sm font-bold text-gray-500">کلاس 10C</p>
          </Button>
        </div>
        <FullCalendar
          plugins={[timeGridPlugin, rrulePlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          hiddenDays={[4, 5]}
          locale={faLocale}
          allDaySlot={false}
          slotMinTime="07:45:00"
          slotMaxTime="14:00:00"
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: false, // برای نمایش ساعت به صورت 12 ساعته با AM/PM
          }}
          slotDuration="00:30:00" // هر اسلات ۳۰ دقیقه باشد
          slotLabelInterval="01:00:00" // برچسب ساعت‌ها هر یک ساعت یک بار
          eventMinHeight={60}
          expandRows={true}
          events={events}
          aspectRatio={1}

        />
      </CardContent>
    </Card>
  );
}
