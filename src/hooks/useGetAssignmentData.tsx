import { getUserInfoProps } from "@/actions/dashboardAction";
import { getAssignments } from "@/actions/assignmentAction"; // اکشن دریافت تکالیف
import { useQuery } from "@tanstack/react-query";

const useGetAssignmentData = (userData: getUserInfoProps | undefined) => {
  const userId = userData?.id;
  const {
    isPending: isAssignmentsPending,
    isError: isAssignmentsError,
    data: assignmentsData,
    refetch: assignmentsRefetch,
  } = useQuery({
    queryKey: ["assignments", userId],
    queryFn: async () => getAssignments(userData!), // فراخوانی اکشن دریافت تکالیف
    enabled: !!userId,
  });

  return {
    isAssignmentsPending,
    isAssignmentsError,
    assignmentsData,
    assignmentsRefetch,
  };
};

export default useGetAssignmentData;
