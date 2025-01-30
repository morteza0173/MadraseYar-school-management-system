import GradeListContent from "@/components/listGrade/GradeListContent";
import { Suspense } from "react";
const page = async () => {
  return (
    <div>
      <Suspense fallback={<div>Loading grade data...</div>}>
        <GradeListContent />
      </Suspense>
    </div>
  );
};
export default page;
