import { getTeacher } from "@/actions/dashboardAction";
import { useQuery } from "@tanstack/react-query";

const useGetTeacher = () => {
  const {
    data: teacherData,
    isPending: isTeacherPending,
    isError: isTeacherError,
    refetch: teacherRefetch,
  } = useQuery({
    queryKey: ["teacher"],
    queryFn: async () => getTeacher(),
  });
  return { teacherData, isTeacherPending, isTeacherError, teacherRefetch };
};
export default useGetTeacher;
