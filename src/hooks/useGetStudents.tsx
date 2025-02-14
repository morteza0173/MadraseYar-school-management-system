import { getStudents } from "@/actions/dashboardAction";
import { useQuery } from "@tanstack/react-query";

const useGetStudents = () => {
 const {
   data: studentData,
   isPending: isStudentPending,
   isError: isStudentError,
   refetch: studentRefetch,
 } = useQuery({
   queryKey: ["students"],
   queryFn: async () => getStudents(),
 });
 return { studentData, isStudentPending, isStudentError, studentRefetch };
}
export default useGetStudents
