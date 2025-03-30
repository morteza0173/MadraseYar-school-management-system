import { getUserInfoProps } from "@/actions/dashboardAction";
import { getEvents } from "@/actions/eventAction";
import { useQuery } from "@tanstack/react-query";

const useGetEventData = (userData: getUserInfoProps | undefined) => {
  const userId = userData?.id;
  const {
    isPending: isEventsPending,
    isError: isEventsError,
    data: eventsData,
    refetch: eventsRefetch,
  } = useQuery({
    queryKey: ["events", userId],
    queryFn: async () => getEvents(userData!), // فراخوانی اکشن دریافت رویدادها
    enabled: !!userId,
  });

  return {
    isEventsPending,
    isEventsError,
    eventsData,
    eventsRefetch,
  };
};

export default useGetEventData;
