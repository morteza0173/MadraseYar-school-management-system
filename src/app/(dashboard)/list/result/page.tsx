"use client";

import { ResultDataTableToolbar } from "@/components/listResult/ResultDataTableToolbar";
import { ResultListColumns } from "@/components/listResult/ResultListColumns";
import { ReusableDataTable } from "@/components/tableComponent/ReusableDataTable";
import { useGetResultData } from "@/hooks/useGetResultData";
import { useUserAuth } from "@/hooks/useUserAuth";

const ResultDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const query = useGetResultData(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست نمرات در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ReusableDataTable
        query={query}
        columns={ResultListColumns}
        mobileVisibility={{ lessonName: false, createdAt: false }}
        desktopVisibility={{ lessonName: true, createdAt: true }}
      >
        {(table) => <ResultDataTableToolbar table={table} />}
      </ReusableDataTable>
    </div>
  );
};

export default ResultDataPage;
