import { Skeleton } from "../ui/skeleton";

const SidebarSkeleton = () => {
  return (
    <div className="w-[16rem] relative bg-sidebar hidden md:block">
      <div className="p-4">
        <div className="flex gap-2 items-center">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6">
          <Skeleton className="w-8 h-3" />
          <div className="flex flex-col gap-4">
            <Skeleton className="w-28 h-4" />
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-14 h-4" />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6">
          <Skeleton className="w-8 h-3" />
          <div className="flex flex-col gap-4">
            <Skeleton className="w-28 h-4" />
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-14 h-4" />
          </div>
        </div>

        <div className="flex gap-2 items-center absolute bottom-4 right-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SidebarSkeleton;
