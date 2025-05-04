import { getUserInfoProps } from "@/actions/dashboardAction";
import { ClassDetailsProps } from "@/db/queries/getClassDetails";
import { useQuery } from "@tanstack/react-query";

export const useGetClassDetails = (user: getUserInfoProps | undefined) => {
  return useQuery<ClassDetailsProps[]>({
    queryKey: ["classDetails", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        throw new Error("خطا در دریافت کلاس‌ها");
      }

      return res.json();
    },
    enabled: !!user,
  });
};
