import { getUserInfoProps } from "@/actions/dashboardAction";
import { ResultProps } from "@/db/queries/getResult";
import { useQuery } from "@tanstack/react-query";

export const useGetResultData = (user: getUserInfoProps | undefined) => {
  return useQuery<ResultProps[]>({
    queryKey: ["results", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        throw new Error("خطا در دریافت نمرات");
      }

      return res.json();
    },
    enabled: !!user,
  });
};
