"use client";

import { EventDataTableToolbar } from "@/components/listEvent/EventDataTableToolbar";
import { EventListColumns } from "@/components/listEvent/EventListColumns";
import { ReusableDataTable } from "@/components/tableComponent/ReusableDataTable";
import { useGetEventData } from "@/hooks/useGetEventData";
import { useUserAuth } from "@/hooks/useUserAuth";

const EventDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const query = useGetEventData(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست رویداد‌ها در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ReusableDataTable
        query={query}
        columns={EventListColumns}
        mobileVisibility={{ date: false }}
        desktopVisibility={{ date: true }}
      >
        {(table) => <EventDataTableToolbar table={table} />}
      </ReusableDataTable>
    </div>
  );
};

export default EventDataPage;
