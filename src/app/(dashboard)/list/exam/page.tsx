"use client";

import { ExamListColumns } from "@/components/listExam/ExamListColumns";
import { ExamListDataTable } from "@/components/listExam/ExamListDataTable";
import { useGetExamData } from "@/hooks/useGetExamData";
import { useUserAuth } from "@/hooks/useUserAuth";

const ExamDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const {
    isPending: isExamsPending,
    data: examsData,
    refetch: examsRefetch,
    isError: isExamsError,
  } = useGetExamData(userData); // استفاده از هوک دریافت امتحانات

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست امتحانات در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ExamListDataTable
        data={examsData || []}
        columns={ExamListColumns}
        isExamsError={isExamsError}
        isExamsPending={isExamsPending}
        examsRefetch={examsRefetch}
      />
    </div>
  );
};

export default ExamDataPage;
