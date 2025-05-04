"use client";

import { AnnouncementListColumns } from "@/components/listAnnouncements/AnnouncementListColumns";
import { AnnouncementListDataTable } from "@/components/listAnnouncements/AnnouncementListDataTable";
import { useGetAnnouncementsData } from "@/hooks/useGetAnnouncementsData";
import { useUserAuth } from "@/hooks/useUserAuth";

const AnnouncementDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "strudent", "parent"]);
  const {
    data: announcementsData,
    isPending: isAnnouncementsPending,
    isError: isAnnouncementsError,
    refetch: announcementsRefetch,
  } = useGetAnnouncementsData(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست اعلامیه‌ها در جدول زیر نمایش داده میشود
        </p>
      </div>
      <AnnouncementListDataTable
        data={announcementsData || []}
        columns={AnnouncementListColumns}
        isAnnouncementsError={isAnnouncementsError}
        isAnnouncementsPending={isAnnouncementsPending}
        announcementsRefetch={announcementsRefetch}
      />
    </div>
  );
};
export default AnnouncementDataPage;
