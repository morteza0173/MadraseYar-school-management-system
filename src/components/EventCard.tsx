import { useUserAuth } from "@/hooks/useUserAuth";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import useGetEventData from "@/hooks/useGetEventData";
import useGetExamData from "@/hooks/useGetExamData";
import useGetAssignmentData from "@/hooks/useGetAssignmentData";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

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

export const EventCard = ({
  daypickerValue,
}: {
  daypickerValue: Date | undefined;
}) => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const { eventsData, isEventsPending } = useGetEventData(userData);
  const { examsData, isExamsPending } = useGetExamData(userData);
  const { assignmentsData, isAssignmentsPending } =
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

  console.log(combinedData);

  return (
    <Card>
      <CardContent className="px-0">
        <div className="flex items-center justify-between pt-4 px-4">
          {daypickerValue ? (
            <p className="text-xs md:text-sm font-bold">
              رویداد های تاریخ{" "}
              {daypickerValue.toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                timeZone: "Asia/Tehran",
              })}
            </p>
          ) : (
            <p className="text-sm md:text-base font-bold">رویداد ها</p>
          )}
        </div>
        {isAssignmentsPending || isEventsPending || isExamsPending ? (
          <div className="flex gap-2 items-center justify-center h-[300px]">
            <Loader2 className="animate-spin w-4 h-4 " />
            <p className="text-xs text-gray-400">درحال دریافت رویداد ها</p>
          </div>
        ) : eventsData?.length === 0 ||
          examsData?.length === 0 ||
          assignmentsData?.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-xs text-gray-400">هیچ رویدادی وجود ندارد</p>
          </div>
        ) : daypickerValue ? (
          <div className="w-full h-[300px] overflow-y-scroll custom-scrollbar mt-4">
            {Object.entries(combinedData).map(([date, items]) => {
              const isSelectedDate =
                new Date(date).toDateString() ===
                daypickerValue?.toDateString();

              if (isSelectedDate) {
                return (
                  <div key={date}>
                    {items.map((item) => (
                      <EventList key={item.id} item={item} />
                    ))}
                  </div>
                );
              }

              return null;
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-xs text-gray-400">
              یک تاریخ برای نمایش رویداد ها انتخاب کنید
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const EventList = ({ item }: { item: CombinedDataItem }) => {
  const router = useRouter();

  return (
    <>
      {item.type === "event" && (
        <div className="w-[94%] h-auto bg-orange-200 rounded-sm mt-2 p-2 mr-2">
          <div className="flex flex-col gap-2 w-auto">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold">رویداد</p>

              <Badge variant="secondary">
                <p className="text-[10px] font-thin">{item.className}</p>
              </Badge>
            </div>
            <Separator className="bg-gray-300" />

            <div className="flex items-center justify-between w-auto">
              <p className="text-xs">{item.title}</p>
            </div>

            <p className="text-xs text-gray-600">{item.description}</p>
          </div>
        </div>
      )}
      {item.type === "exam" && (
        <div className="w-[94%] h-auto bg-sky-200/70 rounded-sm mt-2 p-2 mr-2">
          <div className="flex flex-col gap-2 w-auto">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold">امتحان</p>

              <Badge variant="secondary">
                <p className="text-[10px] font-thin">{item.className}</p>
              </Badge>
            </div>
            <Separator className="bg-gray-300" />

            <div className="flex items-center justify-between w-auto">
              <p className="text-xs">{item.lessonName}</p>
              <Button
                className="bg-blue-300 hover:bg-blue-200 h-6"
                size="sm"
                onClick={() => {
                  sessionStorage.setItem(
                    "previousPath",
                    window.location.pathname
                  );
                  router.push(`/list/result/امتحان/${item.id}`);
                }}
              >
                جزئیات امتحان
              </Button>
            </div>

            <p className="text-xs text-gray-600">{item.title}</p>
          </div>
        </div>
      )}
      {item.type === "assignment" && (
        <div className="w-[94%] h-auto bg-green-200  rounded-sm mt-2 p-2 mr-2">
          <div className="flex flex-col gap-2 w-auto">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold">تکلیف</p>

              <Badge variant="secondary">
                <p className="text-[10px] font-thin">{item.className}</p>
              </Badge>
            </div>
            <Separator className="bg-gray-300" />

            <div className="flex items-center justify-between w-auto">
              <p className="text-xs">{item.lessonName}</p>
              <Button
                className="bg-green-400 hover:bg-green-300 h-6"
                size="sm"
                onClick={() => {
                  sessionStorage.setItem(
                    "previousPath",
                    window.location.pathname
                  );
                  router.push(`/list/result/تکلیف/${item.id}`);
                }}
              >
                جزئیات تکلیف
              </Button>
            </div>

            <p className="text-xs text-gray-600">{item.title}</p>
          </div>
        </div>
      )}
    </>
  );
};
