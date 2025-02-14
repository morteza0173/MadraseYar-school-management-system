import { getAdmins } from "@/actions/dashboardAction";
import { useQuery } from "@tanstack/react-query";

const useGetAdmins = () => {
 const {
   data: adminData,
   isPending: isAdminPending,
   isError: isAdminError,
   refetch: adminRefetch,
 } = useQuery({
   queryKey: ["admins"],
   queryFn: async () => getAdmins(),
 });
 return { adminData, isAdminPending, isAdminError, adminRefetch };
}
export default useGetAdmins
