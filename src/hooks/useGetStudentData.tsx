import { getUserInfoProps } from "@/actions/dashboardAction";
import { getStudentData } from "@/actions/studentAction";
import { useQuery } from "@tanstack/react-query";

const useGetStudentData = (userData: getUserInfoProps | undefined) => {
  const userId = userData?.id;
  const {
    isPending: isStudentDataPending,
    isError: isStudentDataError,
    data: studentData,
    refetch: studentDataRefetch,
  } = useQuery({
    queryKey: ["studentData", userId],
    queryFn: async () => getStudentData(userId!),
    enabled: !!userId,
  });

  return { studentData, isStudentDataPending, isStudentDataError, studentDataRefetch };
};
export default useGetStudentData;
