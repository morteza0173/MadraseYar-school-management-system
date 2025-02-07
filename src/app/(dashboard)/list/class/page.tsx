import ClassListContent from "@/components/ClassList/ClassListContent";
import DataTableSkeleton from "@/components/skeleton/DataTableSkeleton";
import { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={<DataTableSkeleton />}>
        <ClassListContent />
      </Suspense>
    </div>
  );
};
export default page;
