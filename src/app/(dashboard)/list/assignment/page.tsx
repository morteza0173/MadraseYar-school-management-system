"use client";

import { AssignmentDataTableToolbar } from "@/components/listAssignment/AssignmentDataTableToolbar";
import { AssignmentListColumns } from "@/components/listAssignment/AssignmentListColumns";
import { ReusableDataTable } from "@/components/tableComponent/ReusableDataTable";
import { useGetAssignmentData } from "@/hooks/useGetAssignmentData";
import { useUserAuth } from "@/hooks/useUserAuth";

const AssignmentDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const query = useGetAssignmentData(userData);
  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست تکالیف در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ReusableDataTable
        query={query}
        columns={AssignmentListColumns}
        mobileVisibility={{ lessonName: false, remainingTime: false }}
        desktopVisibility={{ lessonName: true, remainingTime: true }}
      >
        {(table) => <AssignmentDataTableToolbar table={table} />}
      </ReusableDataTable>
    </div>
  );
};

export default AssignmentDataPage;
