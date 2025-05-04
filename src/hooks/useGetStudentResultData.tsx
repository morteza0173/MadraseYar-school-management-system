import { RankedStudent } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";

interface UseGetStudentResultDataProps {
  id: number;
  decodedRelatedResult: string;
  role: string;
}

export const useGetStudentResultData = ({
  id,
  decodedRelatedResult,
  role,
}: UseGetStudentResultDataProps) => {
  const data = {
    id,
    decodedRelatedResult,
    role,
  };

  console.log(id, decodedRelatedResult, role);

  return useQuery<RankedStudent[]>({
    queryKey: ["studentResult", id, decodedRelatedResult, role],
    queryFn: async () => {
      const res = await fetch("/api/resultsDetailPage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("خطا در دریافت جزئیات نمرات");
      }

      return res.json();
    },
    enabled: !!id && !!decodedRelatedResult && !!role,
  });
};
