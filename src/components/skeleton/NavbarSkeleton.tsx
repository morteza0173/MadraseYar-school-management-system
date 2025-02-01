import { Skeleton } from "../ui/skeleton";

const NavbarSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex gap-4">
        <div className="flex gap-2 items-center">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="w-6 h-6" />
          <Skeleton className="w-[100px] md:w-[200px]  h-8" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-2 w-8" />
          <Skeleton className="w-6 h-2 " />
        </div>
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    </div>
  );
};
export default NavbarSkeleton;
