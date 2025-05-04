"use client";

import { ResultListColumns } from "@/components/listResult/ResultListColumns";
import { ResultListDataTable } from "@/components/listResult/ResultListDataTable";
import { useGetResultData } from "@/hooks/useGetResultData";
import { useUserAuth } from "@/hooks/useUserAuth";

const ResultDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const {
    isPending: isResultsPending,
    data: resultsData,
    refetch: resultsRefetch,
    isError: isResultsError,
  } = useGetResultData(userData); // استفاده از هوک دریافت نمرات

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست نمرات در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ResultListDataTable
        data={resultsData || []}
        columns={ResultListColumns}
        isResultsError={isResultsError}
        isResultsPending={isResultsPending}
        resultsRefetch={resultsRefetch}
      />
    </div>
  );
};

export default ResultDataPage;
