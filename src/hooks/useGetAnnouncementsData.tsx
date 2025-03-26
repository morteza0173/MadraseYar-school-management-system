import { getUserInfoProps } from "@/actions/dashboardAction";
import { getAnnouncements } from "@/actions/announcementAction";
import { useQuery } from "@tanstack/react-query";

const useGetAnnouncementsData = (userData: getUserInfoProps | undefined) => {
  const userId = userData?.id;
  const {
    isPending: isAnnouncementsPending,
    isError: isAnnouncementsError,
    data: announcementsData,
    refetch: announcementsRefetch,
  } = useQuery({
    queryKey: ["announcements", userId],
    queryFn: async () => getAnnouncements(userData!),
    enabled: !!userId,
  });

  return {
    isAnnouncementsPending,
    isAnnouncementsError,
    announcementsData,
    announcementsRefetch,
  };
};

export default useGetAnnouncementsData;
