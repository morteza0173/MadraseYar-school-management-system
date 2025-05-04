"use client";
import { ParentListColumns } from "@/components/listParent/ParentListColumns";
import { ParentListDataTable } from "@/components/listParent/ParentListDataTable";
import { useGetParentData } from "@/hooks/useGetParentData";
import { useUserAuth } from "@/hooks/useUserAuth";

const ParentDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher"]);
  const {
    refetch: parentRefetch,
    data: parentData,
    isError: isParentError,
    isPending: isParentPending,
  } = useGetParentData();

  console.log(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست والدین در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ParentListDataTable
        data={parentData || []}
        columns={ParentListColumns}
        isParentDataError={isParentError}
        isParentDataPending={isParentPending}
        parentDataRefetch={parentRefetch}
      />
    </div>
  );
};
export default ParentDataPage;
