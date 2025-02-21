import { getUserInfoProps } from "@/actions/dashboardAction";
import { getTeacherData } from "@/actions/teacherAction";
import { useQuery } from "@tanstack/react-query";

const useGetTeacherData = (userData: getUserInfoProps | undefined) => {
  const userId = userData?.id;
  const {
    isPending: isTeacherDataPending,
    isError: isTeacherDataError,
    data: teacherData,
    refetch: teacherDataRefetch,
  } = useQuery({
    queryKey: ["teacherData", userId],
    queryFn: async () => getTeacherData(userId!),
    enabled: !!userId,
  });

  return { teacherData , isTeacherDataError , isTeacherDataPending , teacherDataRefetch};
};
export default useGetTeacherData;
