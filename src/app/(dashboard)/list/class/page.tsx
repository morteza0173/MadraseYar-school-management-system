"use client";
import { classListColumns } from "@/components/ClassList/classListColumns";
import { ClassListDataTableViewOptions } from "@/components/ClassList/ClassListDataTableViewOptions";
import { ReusableDataTable } from "@/components/tableComponent/ReusableDataTable";
import { useGetClassDetails } from "@/hooks/useGetClassDetails";
import { useUserAuth } from "@/hooks/useUserAuth";

const ClassPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);

  const query = useGetClassDetails(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between my-8">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست تمام کلاس ها در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ReusableDataTable
        query={query}
        columns={classListColumns}
        mobileVisibility={{ grade: false, supervisor: false }}
        desktopVisibility={{ grade: true, supervisor: true }}
      >
        {(table) => <ClassListDataTableViewOptions table={table} />}
      </ReusableDataTable>
    </div>
  );
};
export default ClassPage;
