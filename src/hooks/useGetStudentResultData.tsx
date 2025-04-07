import { getExamOrAssignmentDetails } from "@/actions/resultDetailPageAction";
import { useQuery } from "@tanstack/react-query";

interface UseGetStudentResultDataProps {
  id: number;
  decodedRelatedResult: string;
  role: string;
}

const useGetStudentResultData = ({
  id,
  decodedRelatedResult,
  role,
}: UseGetStudentResultDataProps) => {
  const {
    isLoading: isResultPending,
    isError: isResultError,
    data: resultData,
    refetch: resultRefetch,
  } = useQuery({
    queryKey: ["studentResult", id, decodedRelatedResult, role],
    queryFn: async () =>
      getExamOrAssignmentDetails({ id, decodedRelatedResult, role }),
    enabled: !!id && !!decodedRelatedResult && !!role,
  });

  return {
    isResultPending,
    isResultError,
    resultData,
    resultRefetch,
  };
};

export default useGetStudentResultData;
