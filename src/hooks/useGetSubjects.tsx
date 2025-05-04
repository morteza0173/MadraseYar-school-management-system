import { getUserInfoProps } from "@/actions/dashboardAction";
import { SubjectDataProps } from "@/db/queries/getSubject";
import { useQuery } from "@tanstack/react-query";

export const useGetSubjects = (userData: getUserInfoProps | undefined) => {
  const userId = userData?.id;
  return useQuery<SubjectDataProps[]>({
    queryKey: ["subjects", userId],
    queryFn: async () => {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userId),
      });
      if (!res.ok) {
        throw new Error("خطا در دریافت دروس");
      }
      return res.json();
    },
    enabled: !!userId,
  });
};
