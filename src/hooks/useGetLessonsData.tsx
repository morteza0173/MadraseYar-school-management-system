import { getUserInfoProps } from "@/actions/dashboardAction";
import { getLessonsProps } from "@/db/queries/getLessons";
import { useQuery } from "@tanstack/react-query";

export const useGetLessonsData = (user: getUserInfoProps | undefined) => {
  return useQuery<getLessonsProps[]>({
    queryKey: ["lessons", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        throw new Error("خطا در دریافت درس‌ها");
      }

      return res.json();
    },
    enabled: !!user,
  });
};
