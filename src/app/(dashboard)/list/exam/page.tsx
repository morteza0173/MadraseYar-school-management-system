"use client";

import { ExamDataTableToolbar } from "@/components/listExam/ExamDataTableToolbar";
import { ExamListColumns } from "@/components/listExam/ExamListColumns";
import { ReusableDataTable } from "@/components/tableComponent/ReusableDataTable";
import { useGetExamData } from "@/hooks/useGetExamData";
import { useUserAuth } from "@/hooks/useUserAuth";

const ExamDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const query = useGetExamData(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست امتحانات در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ReusableDataTable
        query={query}
        columns={ExamListColumns}
        mobileVisibility={{ lessonName: false, remainingTime: false }}
        desktopVisibility={{ lessonName: true, remainingTime: true }}
      >
        {(table) => <ExamDataTableToolbar table={table} />}
      </ReusableDataTable>
    </div>
  );
};

export default ExamDataPage;
