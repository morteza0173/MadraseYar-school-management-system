import { getUserInfoProps } from "@/actions/dashboardAction";
import { AssignmentsProps } from "@/db/queries/getAssignments";
import { useQuery } from "@tanstack/react-query";

export const useGetAssignmentData = (user: getUserInfoProps | undefined) => {
  return useQuery<AssignmentsProps[]>({
    queryKey: ["assignments", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        throw new Error("خطا در دریافت تکالیف");
      }

      return res.json();
    },
    enabled: !!user,
  });
};
