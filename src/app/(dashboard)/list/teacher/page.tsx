"use client";
import { TeacherDataTableToolbar } from "@/components/listTeacher/TeacherDataTableToolbar";
import { TeacherListColumns } from "@/components/listTeacher/TeacherListColumns";
import { ReusableDataTable } from "@/components/tableComponent/ReusableDataTable";
import { useGetTeacherData } from "@/hooks/useGetTeacherData";
import { useUserAuth } from "@/hooks/useUserAuth";

const TeacherDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "strudent", "parent"]);
  const query = useGetTeacherData(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست معلمان در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ReusableDataTable
        query={query}
        columns={TeacherListColumns}
        mobileVisibility={{
          phone: false,
          subject: false,
          eventOnGoing: false,
        }}
        desktopVisibility={{
          phone: true,
          subject: true,
          eventOnGoing: true,
        }}
      >
        {(table) => <TeacherDataTableToolbar table={table} />}
      </ReusableDataTable>
    </div>
  );
};
export default TeacherDataPage;
