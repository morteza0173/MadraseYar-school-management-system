"use client";

import { StudentDataTableToolbar } from "@/components/listStudent/StudentDataTableToolbar";
import { StudentListColumns } from "@/components/listStudent/StudentListColumns";
import { ReusableDataTable } from "@/components/tableComponent/ReusableDataTable";
import { useGetStudentData } from "@/hooks/useGetStudentData";
import { useUserAuth } from "@/hooks/useUserAuth";

const StudentDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "strudent", "parent"]);
  const query = useGetStudentData(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست دانش‌آموزان در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ReusableDataTable
        query={query}
        columns={StudentListColumns}
        mobileVisibility={{
          phone: false,
          address: false,
          parent: false,
          upcomingAssignments: false,
          upcomingExams: false,
        }}
        desktopVisibility={{
          phone: false,
          address: false,
          parent: true,
          upcomingAssignments: true,
          upcomingExams: true,
        }}
      >
        {(table) => <StudentDataTableToolbar table={table} />}
      </ReusableDataTable>
    </div>
  );
};
export default StudentDataPage;
