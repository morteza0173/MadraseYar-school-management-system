"use client";

import { AnnouncementDataTableToolbar } from "@/components/listAnnouncements/AnnouncementDataTableToolbar";
import { AnnouncementListColumns } from "@/components/listAnnouncements/AnnouncementListColumns";
import { ReusableDataTable } from "@/components/tableComponent/ReusableDataTable";
import { useGetAnnouncementsData } from "@/hooks/useGetAnnouncementsData";
import { useUserAuth } from "@/hooks/useUserAuth";

const AnnouncementDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "strudent", "parent"]);
  const query = useGetAnnouncementsData(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست اعلامیه‌ها در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ReusableDataTable
        query={query}
        columns={AnnouncementListColumns}
        mobileVisibility={{ date: false }}
        desktopVisibility={{ date: true }}
      >
        {(table) => <AnnouncementDataTableToolbar table={table} />}
      </ReusableDataTable>
    </div>
  );
};
export default AnnouncementDataPage;
