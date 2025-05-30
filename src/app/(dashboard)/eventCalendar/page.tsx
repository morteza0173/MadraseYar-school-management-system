"use client";
import { EventDatePicker } from "@/components/ClanderDatePicker";
import { EventList } from "@/components/EventCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAssignmentData } from "@/hooks/useGetAssignmentData";
import { useGetEventData } from "@/hooks/useGetEventData";
import { useGetExamData } from "@/hooks/useGetExamData";
import { useUserAuth } from "@/hooks/useUserAuth";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

const EventPage = () => {
  const [daypickerValue, setDaypickerValue] = useState<Date | undefined>(
    new Date()
  );
  return (
    <div className="px-1 md:px-4 flex flex-col xl:flex-row gap-2 h-full">
      {/* right */}
      <div className="w-full xl:w-8/12 h-auto">
        <div>
          <EventDatePicker
            setDaypickerValue={setDaypickerValue}
            daypickerValue={daypickerValue}
          />
        </div>
      </div>

      {/* left */}
      <div className="w-full xl:w-4/12 h-fit md:h-full">
        <div className="h-fit md:h-full">
          <Card className="flex flex-col overflow-hidden">
            <CardHeader>
              <CardTitle>رویداد ها</CardTitle>
              <CardDescription>
                {daypickerValue
                  ? `رویداد تاریخ ${daypickerValue.toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      timeZone: "Asia/Tehran",
                    })}`
                  : "یک تاریخ را انتخاب کنید"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <EventCardInEventPage daypickerValue={daypickerValue} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default EventPage;

type CombinedDataItem = {
  id: number;
  title: string;
  startTime?: Date;
  dueDate?: Date;
  type: "event" | "exam" | "assignment";
  description?: string;
  lessonName?: string;
  className?: string;
};

const normalizeDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

function EventCardInEventPage({
  daypickerValue,
}: {
  daypickerValue: Date | undefined;
}) {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const { data: eventsData, isPending: isEventsPending } =
    useGetEventData(userData);
  const { data: examsData, isPending: isExamsPending } =
    useGetExamData(userData);
  const { data: assignmentsData, isPending: isAssignmentsPending } =
    useGetAssignmentData(userData);

  const combinedData = useMemo(() => {
    const allData: CombinedDataItem[] = [
      ...(eventsData?.map((event) => ({
        id: event.id,
        description: event.description,
        className: event.className,
        title: event.title,
        startTime: event.startTime,
        type: "event" as const,
      })) || []),
      ...(examsData?.map((exam) => ({
        id: exam.id,
        title: exam.title,
        lessonName: exam.lessonName,
        className: exam.className,
        startTime: exam.startTime,
        type: "exam" as const,
      })) || []),
      ...(assignmentsData?.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        lessonName: assignment.lessonName,
        className: assignment.className,
        dueDate: assignment.dueDate,
        type: "assignment" as const,
      })) || []),
    ];

    const groupedByDate = allData.reduce(
      (acc: Record<string, CombinedDataItem[]>, item) => {
        const rawDate = new Date(item.startTime || item.dueDate!);
        const dateKey = normalizeDate(rawDate).toDateString();
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

  if (isAssignmentsPending || isEventsPending || isExamsPending) {
    return (
      <div className="h-fit md:h-[700px]">
        <div className="flex gap-2 justify-center h-full mb-8">
          <Loader2 className="animate-spin w-4 h-4 " />
          <p className="text-xs text-gray-400">درحال دریافت رویداد ها</p>
        </div>
      </div>
    );
  }

  if (
    eventsData &&
    eventsData.length === 0 &&
    examsData &&
    examsData.length === 0 &&
    assignmentsData &&
    assignmentsData.length === 0
  ) {
    return (
      <div className="h-fit md:h-[700px]">
        <div className="flex justify-center h-full mb-8">
          <p className="text-xs text-gray-400">هیچ رویدادی وجود ندارد</p>
        </div>
      </div>
    );
  }

  const selectedDateKey = daypickerValue
    ? normalizeDate(daypickerValue).toDateString()
    : null;

  return (
    <div className="h-fit md:h-[700px] overflow-y-auto custom-scrollbar">
      <div className="h-full mb-40">
        {daypickerValue ? (
          <div className="w-full">
            {selectedDateKey && combinedData[selectedDateKey] ? (
              combinedData[selectedDateKey].map((item) => (
                <EventList key={item.id} item={item} />
              ))
            ) : (
              <div className="flex justify-center h-fit md:h-[700px]">
                <p className="text-xs text-gray-400">
                  در این تاریخ رویدادی وجود ندارد
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center h-fit md:h-[700px]">
            <p className="text-xs text-gray-400">
              یک تاریخ برای نمایش رویداد ها انتخاب کنید
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
