"use client";
import { gradeListColumns } from "@/components/listGrade/gradeListColumns";
import { GradeListDataTableViewOptions } from "@/components/listGrade/GradeListDataTableViewOptions";
import { ReusableDataTable } from "@/components/tableComponent/ReusableDataTable";
import { useGetGradeData } from "@/hooks/useGetGradeData";
import { useUserAuth } from "@/hooks/useUserAuth";
const GradePage = () => {
  useUserAuth(["admin"]);

  const query = useGetGradeData();

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between my-8">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست سال تحصیلی در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ReusableDataTable query={query} columns={gradeListColumns}>
        {(table) => <GradeListDataTableViewOptions table={table} />}
      </ReusableDataTable>
    </div>
  );
};
export default GradePage;
