import { getUserInfoProps } from "@/actions/dashboardAction";
import { getExams } from "@/actions/examAction";
import { useQuery } from "@tanstack/react-query";

const useGetExamData = (userData: getUserInfoProps | undefined) => {
  const userId = userData?.id;
  const {
    isPending: isExamsPending,
    isError: isExamsError,
    data: examsData,
    refetch: examsRefetch,
  } = useQuery({
    queryKey: ["exams", userId],
    queryFn: async () => getExams(userData!), 
    enabled: !!userId,
  });

  return {
    isExamsPending,
    isExamsError,
    examsData,
    examsRefetch,
  };
};

export default useGetExamData;
