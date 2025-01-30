import ClassListContent from "@/components/listClass/ClassListContent";
import { Suspense } from "react";

const page = async () => {
  return (
    <div>
      <Suspense fallback={<div>Loading class data...</div>}>
        <ClassListContent />
      </Suspense>
    </div>
  );
};
export default page;
