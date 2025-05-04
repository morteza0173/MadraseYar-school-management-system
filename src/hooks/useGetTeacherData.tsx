import { getUserInfoProps } from "@/actions/dashboardAction";
import { FormattedTeacher } from "@/db/queries/getTeacher";
import { useQuery } from "@tanstack/react-query";

export const useGetTeacherData = (userData: getUserInfoProps | undefined) => {
  const userId = userData?.id;
  return useQuery<FormattedTeacher[]>({
    queryKey: ["teacherData", userId],
    queryFn: async () => {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userId),
      });
      if (!res.ok) {
        throw new Error("خطا در دریافت اطلاعات معلمین");
      }
      return res.json();
    },
    enabled: !!userId,
  });
};
