"use client";
import { ParentDataTableToolbar } from "@/components/listParent/ParentDataTableToolbar";
import { ParentListColumns } from "@/components/listParent/ParentListColumns";
import { ReusableDataTable } from "@/components/tableComponent/ReusableDataTable";
import { useGetParentData } from "@/hooks/useGetParentData";
import { useUserAuth } from "@/hooks/useUserAuth";

const ParentDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher"]);
  const query = useGetParentData();

  console.log(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست والدین در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ReusableDataTable
        query={query}
        columns={ParentListColumns}
        mobileVisibility={{ phone: false }}
        desktopVisibility={{ phone: true }}
      >
        {(table) => <ParentDataTableToolbar table={table} />}
      </ReusableDataTable>
    </div>
  );
};
export default ParentDataPage;
