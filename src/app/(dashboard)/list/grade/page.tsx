import GradeListContent from "@/components/listGrade/GradeListContent";
import DataTableSkeleton from "@/components/skeleton/DataTableSkeleton";
import { Suspense } from "react";
const page = () => {
  return (
    <div>
      <Suspense fallback={<DataTableSkeleton />}>
        <GradeListContent />
      </Suspense>
    </div>
  );
};
export default page;
