"use client";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import faLocale from "@fullcalendar/core/locales/fa";
import rrulePlugin from "@fullcalendar/rrule";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { createRoot } from "react-dom/client";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useGetLessonsData } from "@/hooks/useGetLessonsData";
import { getLessonsProps } from "@/db/queries/getLessons";




interface transformedLessonsProps {
  title: string;
  duration: string;
  color: string;
  borderColor: string;
  rrule: {
    freq: string;
    interval: number;
    byweekday: string[];
    dtstart: string;
    until: string;
  };
  extendedProps: {
    description: string;
  };
}

const dayMapping: Record<string, string> = {
  شنبه: "sa",
  یکشنبه: "su",
  دوشنبه: "mo",
  سه‌شنبه: "tu",
  چهارشنبه: "we",
};

export default function WeeklyCalendarTeacher() {
  const { userData ,isUserPending} = useUserAuth(["teacher"]);
  const { data:lessonsData, isPending:isLessonsPending, isError:isLessonsError,refetch:lessonsRefetch
  } =
    useGetLessonsData(userData);

  const [transformedLessons, setTransformedLessons] = useState<
    transformedLessonsProps[]
  >([]);

  useEffect(() => {
    if (lessonsData) {

      const transformedLessons = lessonsData?.map((lesson) => ({
        title: lesson.lessonName,
        duration: calculateDuration(lesson.startTime, lesson.endTime),
        color: "#ffedd5",
        borderColor: "gray",
        rrule: {
          freq: "weekly",
          interval: 1,
          byweekday: [dayMapping[lesson.day]],
          dtstart: `2025-01-01T${lesson.startTime}:00`,
          until: "2025-06-01",
        },
        extendedProps: {
          description: lesson.className,
        },
      }));

      setTransformedLessons(transformedLessons);
    }
  }, [lessonsData]);


   const { slotMinTime, slotMaxTime } = useMemo(() => {
    if (!lessonsData || lessonsData.length === 0) {
      return { slotMinTime: "07:00:00", slotMaxTime: "14:00:00" };
    }

    let minMinutes = Infinity;
    let maxMinutes = -Infinity;
    lessonsData.forEach((lesson: getLessonsProps) => {
      const [startHour, startMinute] = lesson.startTime.split(":").map(Number);
      const [endHour, endMinute] = lesson.endTime.split(":").map(Number);
      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      if (startTotal < minMinutes) minMinutes = startTotal;
      if (endTotal > maxMinutes) maxMinutes = endTotal;
    });

    const minHour = Math.floor(minMinutes / 60);
    const maxHour = maxMinutes % 60 === 0 ? Math.floor(maxMinutes / 60) : Math.floor(maxMinutes / 60) + 1;

    return {
      slotMinTime: `${minHour.toString().padStart(2, "0")}:00:00`,
      slotMaxTime: `${maxHour.toString().padStart(2, "0")}:00:00`,
    };
  }, [lessonsData]);

  function calculateDuration(startTime: string, endTime: string): string {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    const diffMinutes = endTotal - startTotal;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <Card>
      <CardContent className="p-0 md:p-2 lg:p-4">
        <div className="flex justify-between m-4 md:m-2 lg:m-0 md:mb-2 lg:mb-4 ">
          <h2 className="">برنامه هفتگی</h2>
          <Button disabled variant="outline">
            <div className="text-sm font-bold text-gray-500">{isUserPending ? <div><Loader2 size={4} className="animate-spin"/></div>:`${userData?.name} ${userData?.surname}`}</div>
          </Button>
        </div>
       {isLessonsPending ?
        <div className="flex gap-2 items-center justify-center my-4">
           <Loader2 className=" animate-spin w-4 h-4"/>
           <p className="text-xs font-bold">در حال دریافت برنامه هفتگی</p>
        </div>
        : isLessonsError ?
         <div className="flex gap-2 items-center justify-center my-4">
            <p className="text-xs font-bold">خطا در دریافت برنامه هفتگی</p>
            <Button onClick={()=>lessonsRefetch()} variant="outline">
              تلاش مجدد
            </Button>
         </div>
        : <FullCalendar
          plugins={[timeGridPlugin, rrulePlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          hiddenDays={[4, 5]}
          locale={faLocale}
          allDaySlot={false}
          slotMinTime={slotMinTime}
          slotMaxTime={slotMaxTime}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
          }}
          slotDuration="00:30:00"
          slotLabelInterval="01:00:00"
          eventMinHeight={60}
          expandRows={true}
          events={transformedLessons || []}
          eventTextColor="black"
          aspectRatio={1}
          eventContent={(info) => {
            if (!info.event.start || !info.event.end) {
              return { html: `<div>تاریخ شروع یا پایان موجود نیست</div>` };
            }

            const startTime = format(info.event.start, "HH:mm");
            const endTime = format(info.event.end, "HH:mm");
            const description =
              info.event.extendedProps.description || "بدون توضیحات";

            const containerEl = document.createElement("div");
            containerEl.style.height = "100%";

            const root = createRoot(containerEl);
            root.render(
              <div className="flex flex-col pt-1 justify-between items-center h-full">
                <span className="block text-[0.5rem] md:text-xs">
                  {startTime} - {endTime}
                </span>
                <p className="block text-[0.4rem] md:text-xs font-extrabold">
                  {info.event.title}
                </p>

                <div className="flex justify-around items-center w-full h-6 bg-orange-200">
                  <p className=" block text-[0.6rem] md:text-xs ">کلاس</p>
                  <p className=" block text-[0.6rem] md:text-xs ">
                    {description}
                  </p>
                </div>
              </div>
            );

            return { domNodes: [containerEl] };
          }}
        /> }
      </CardContent>
    </Card>
  );
}
