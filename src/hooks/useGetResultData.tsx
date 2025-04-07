import { getUserInfoProps } from "@/actions/dashboardAction";
import { getResults } from "@/actions/ResultAction"; // اکشن دریافت نمرات
import { useQuery } from "@tanstack/react-query";

const useGetResultData = (userData: getUserInfoProps | undefined) => {
  const userId = userData?.id;
  const {
    isPending: isResultsPending,
    isError: isResultsError,
    data: resultsData,
    refetch: resultsRefetch,
  } = useQuery({
    queryKey: ["results", userId],
    queryFn: async () => getResults(userData!), // فراخوانی اکشن دریافت نمرات
    enabled: !!userId,
  });

  return {
    isResultsPending,
    isResultsError,
    resultsData,
    resultsRefetch,
  };
};

export default useGetResultData;
