import { getUserInfoProps } from "@/actions/dashboardAction";
import { AnnouncementsProps } from "@/db/queries/getAnnouncements";
import { useQuery } from "@tanstack/react-query";

export function useGetAnnouncementsData(user: getUserInfoProps | undefined) {
  return useQuery<AnnouncementsProps[]>({
    queryKey: ["announcements", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        throw new Error("خطا در دریافت اطلاعیه‌ها");
      }

      return res.json();
    },
    enabled: !!user,
  });
}
