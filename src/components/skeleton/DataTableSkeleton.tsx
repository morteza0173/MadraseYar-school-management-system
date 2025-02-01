import { Skeleton } from "../ui/skeleton";

const DataTableSkeleton = () => {
  return (
    <div className="p-4">
      <Skeleton className="mt-10 w-96 h-4" />
      <div className="flex items-center justify-between">
        <div className="mt-10 flex gap-2">
          <Skeleton className="w-16 h-8" />
          <Skeleton className="w-16 h-8" />
        </div>
        <div className="mt-10 flex gap-2">
          <Skeleton className="w-16 h-8" />
          <Skeleton className="w-16 h-8" />
        </div>
      </div>
      <div className="mt-2 w-full h-96">
        <Skeleton className="w-[100%] h-full" />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <Skeleton className="w-28 h-6" />
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-12 h-6" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="w-6 h-6" />
          <Skeleton className="w-12 h-6" />
          <Skeleton className="w-6 h-6" />
          <Skeleton className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
export default DataTableSkeleton;
