"use client";


import { AssignmentListColumns } from "@/components/listAssignment/AssignmentListColumns";
import { AssignmentListDataTable } from "@/components/listAssignment/AssignmentListDataTable";
import useGetAssignmentData from "@/hooks/useGetAssignmentData";
import { useUserAuth } from "@/hooks/useUserAuth";

const AssignmentDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const {
    isAssignmentsPending,
    assignmentsData,
    assignmentsRefetch,
    isAssignmentsError,
  } = useGetAssignmentData(userData); // استفاده از هوک دریافت تکالیف

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست تکالیف در جدول زیر نمایش داده میشود
        </p>
      </div>
      <AssignmentListDataTable
        data={assignmentsData || []}
        columns={AssignmentListColumns}
        isAssignmentsError={isAssignmentsError}
        isAssignmentsPending={isAssignmentsPending}
        assignmentsRefetch={assignmentsRefetch}
      />
    </div>
  );
};

export default AssignmentDataPage;
