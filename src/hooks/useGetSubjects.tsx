import { getUserInfoProps } from "@/actions/dashboardAction";
import { getSubjectsData } from "@/actions/subjectAction";
import { useQuery } from "@tanstack/react-query";

const useGetSubjects = (userData: getUserInfoProps | undefined) => {
  const userId = userData?.id;
  const {
    isPending: isSubjectPending,
    isError: isSubjectError,
    data: subjectData,
    refetch: subjectRefetch,
  } = useQuery({
    queryKey: ["subjects", userId],
    queryFn: async () => getSubjectsData(userId!),
    enabled: !!userId,
  });

  return { isSubjectPending, isSubjectError, subjectData, subjectRefetch };
};
export default useGetSubjects;
