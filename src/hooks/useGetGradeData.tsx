import { gradeListProps } from "@/db/queries/getGrade";
import { useQuery } from "@tanstack/react-query";

export const useGetGradeData = () => {
  return useQuery<gradeListProps[]>({
    queryKey: ["grade"],
    queryFn: async () => {
      const res = await fetch("/api/grade", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("خطا در دریافت سال تحصیلی");
      }

      return res.json();
    },
  });
};
