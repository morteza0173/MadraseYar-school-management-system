import { ParentSingleType } from "@/db/queries/getParent";
import { useQuery } from "@tanstack/react-query";

export const useGetParentData = () => {
  return useQuery<ParentSingleType[]>({
    queryKey: ["parent"],
    queryFn: async () => {
      const res = await fetch("/api/parent", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("خطا در دریافت والدین");
      }

      return res.json();
    },
  });
};
