import { getClassDetails } from "@/actions/classAction";
import { getUserInfoProps } from "@/actions/dashboardAction";
import { useQuery } from "@tanstack/react-query";

const useGetClassDetails = (userData: getUserInfoProps | undefined) => {
  const userId = userData?.id;
  const {
    isPending: isClassPending,
    isError: isClassError,
    data: ClassData,
    refetch: classRefetch,
  } = useQuery({
    queryKey: ["classDetails", userId],
    queryFn: async () => getClassDetails(userData!),
    enabled: !!userId,
  });

  return { isClassPending, isClassError, ClassData, classRefetch };
};
export default useGetClassDetails;
