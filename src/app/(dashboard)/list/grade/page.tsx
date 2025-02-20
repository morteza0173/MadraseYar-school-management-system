"use client";
import { gradeListColumns } from "@/components/listGrade/gradeListColumns";
import { GradeListDataTable } from "@/components/listGrade/GradeListDataTable";
import useGetGradeData from "@/hooks/useGetGradeData";
import { useUserAuth } from "@/hooks/useUserAuth";
const GradePage = () => {
  useUserAuth(["admin"]);

  const { gradeData, gradeRefetch, isGradeError, isGradePending } =
    useGetGradeData();

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between my-8">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست سال تحصیلی در جدول زیر نمایش داده میشود
        </p>
      </div>
      <GradeListDataTable
        isPending={isGradePending}
        isError={isGradeError}
        refetch={gradeRefetch}
        data={gradeData || []}
        columns={gradeListColumns}
      />
    </div>
  );
};
export default GradePage;
