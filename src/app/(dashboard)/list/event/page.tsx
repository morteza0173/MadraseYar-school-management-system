"use client";

import { EventListColumns } from "@/components/listEvent/EventListColumns";
import { EventListDataTable } from "@/components/listEvent/EventListDataTable";
import { useGetEventData } from "@/hooks/useGetEventData";
import { useUserAuth } from "@/hooks/useUserAuth";

const EventDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const {
    isPending: isEventsPending,
    data: eventsData,
    refetch: eventsRefetch,
    isError: isEventsError,
  } = useGetEventData(userData); // استفاده از هوک دریافت رویدادها

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست رویداد‌ها در جدول زیر نمایش داده میشود
        </p>
      </div>
      <EventListDataTable
        data={eventsData || []}
        columns={EventListColumns}
        isEventsError={isEventsError}
        isEventsPending={isEventsPending}
        eventsRefetch={eventsRefetch}
      />
    </div>
  );
};

export default EventDataPage;
