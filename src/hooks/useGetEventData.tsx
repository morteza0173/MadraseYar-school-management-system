import { getUserInfoProps } from "@/actions/dashboardAction";
import { EventsProps } from "@/db/queries/getEvents";
import { useQuery } from "@tanstack/react-query";

export const useGetEventData = (user: getUserInfoProps | undefined) => {
  return useQuery<EventsProps[]>({
    queryKey: ["events", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        throw new Error("خطا در دریافت رویداد‌ها");
      }

      return res.json();
    },
    enabled: !!user,
  });
};
