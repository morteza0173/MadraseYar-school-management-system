import { getUserInfoProps } from "@/actions/dashboardAction";
import { StudentDataProps } from "@/db/queries/getStudents";
import { useQuery } from "@tanstack/react-query";

export const useGetStudentData = (userData: getUserInfoProps | undefined) => {
  const userId = userData?.id;
  return useQuery<StudentDataProps[]>({
    queryKey: ["studentData", userId],
    queryFn: async () => {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userId),
      });
      if (!res.ok) {
        throw new Error("خطا در دریافت دانش‌آموزان");
      }

      return res.json();
    },
    enabled: !!userId,
  });
};
