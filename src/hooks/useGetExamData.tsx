import { getUserInfoProps } from "@/actions/dashboardAction";
import { ExamsProps } from "@/db/queries/getExams";
import { useQuery } from "@tanstack/react-query";

export const useGetExamData = (user: getUserInfoProps | undefined) => {
  return useQuery<ExamsProps[]>({
    queryKey: ["exams", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        throw new Error("خطا در دریافت امتحانات");
      }

      return res.json();
    },
    enabled: !!user,
  });
};
