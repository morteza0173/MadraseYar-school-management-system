import { GetGradeData } from "@/actions/gradeActions";
import { useQuery } from "@tanstack/react-query";

const useGetGradeData = () => {
    const {
      isPending: isGradePending,
      isError: isGradeError,
      data: gradeData,
      refetch: gradeRefetch,
    } = useQuery({
      queryKey: ["grade"],
      queryFn: async () => GetGradeData(),
    });
  return { isGradePending, isGradeError, gradeData, gradeRefetch };
}
export default useGetGradeData
