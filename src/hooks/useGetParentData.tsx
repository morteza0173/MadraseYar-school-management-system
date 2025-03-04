import { getParentData } from "@/actions/parentAction";
import { useQuery } from "@tanstack/react-query";

const useGetParentData = () => {
  const {
    data:parentData,
    isPending: isParentPending,
    isError: isParentError,
    refetch: parentRefetch,
  } = useQuery({
    queryKey: ["parent"],
    queryFn: async () => getParentData(),
  });
  return { parentData, isParentPending, isParentError, parentRefetch };
};
export default useGetParentData;
