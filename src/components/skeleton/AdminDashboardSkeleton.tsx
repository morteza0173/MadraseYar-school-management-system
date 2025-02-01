import { Skeleton } from "../ui/skeleton";

export const AdminDashboardSkeleton = () => {
  return (
    <div className="p-4 flex gap-4 flex-col lg:flex-row  justify-center">
      {/* RIGHT */}
      <div className="w-full lg:w-2/3 max-w-[1060px]">
        {/* USERCARD */}
        <div className="flex gap-4 justify-between flex-wrap">
          <Skeleton className="rounded-2xl p-4 flex-1 min-w-[170px] shadow-sm w-full h-40" />
          <Skeleton className="rounded-2xl p-4 flex-1 min-w-[170px] shadow-sm w-full h-40" />
          <Skeleton className="rounded-2xl p-4 flex-1 min-w-[170px] shadow-sm w-full h-40" />
          <Skeleton className="rounded-2xl p-4 flex-1 min-w-[170px] shadow-sm w-full h-40" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col mt-4 xl:flex-row w-auto justify-center">
          {/* count Chart */}
          <div className="w-full xl:w-[33%] h-[300px] xl:h-[450px]">
            <Skeleton className="w-full h-[300px] xl:h-[450px] p-4" />
          </div>
          {/* chart hozor */}
          <div className="w-full xl:w-[64%] h-[450px] xl:h-[450px]">
            <Skeleton className="h-[400px] xl:h-[450px] w-full p-4" />
          </div>
        </div>

        {/* BOTTOM CHARTS */}
        <div className="my-8 xl:my-4">
          <Skeleton className="w-full h-40 p-4" />
        </div>
      </div>
      {/* LEFT */}
      <div className="w-full lg:w-1/3 h-80 xl:max-w-[530px]">
        <div className="w-full flex flex-col md:flex-row lg:flex-col gap-4">
          {/* datepicker */}
          <div className="md:h-[380px] lg:h-80  mt-10 lg:mt-0">
            <Skeleton className="w-full h-80 p-4" />
          </div>
          <div className="w-full h-80 md:mt-10 lg:mt-0">
            <Skeleton className="w-full h-80 p-4" />
          </div>
        </div>
        <div className="mt-4">
          <Skeleton className="w-full h-80 p-4" />
        </div>
      </div>
    </div>
  );
};
