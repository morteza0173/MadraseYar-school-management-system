import { getUserInfoProps } from "@/actions/dashboardAction";
import { getLessonsData } from "@/actions/lessonsAction";
import { useQuery } from "@tanstack/react-query";

const useGetLessonsData = (userData: getUserInfoProps | undefined) => {
  const userId = userData?.id;
  const {
    isPending: isLessonsPending,
    isError: isLessonsError,
    data: lessonsData,
    refetch: lessonsRefetch,
  } = useQuery({
    queryKey: ["lessons", userId],
    queryFn: async () => getLessonsData(userId!),
    enabled: !!userId,
  });

  return { isLessonsPending, isLessonsError, lessonsData, lessonsRefetch };
};
export default useGetLessonsData;
