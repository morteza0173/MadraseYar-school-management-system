"use client";

import { SubjectListColumns } from "@/components/listSubject/SubjectListColumns";
import { SubjectListDataTableViewOptions } from "@/components/listSubject/SubjectListDataTableViewOptions";
import { ReusableDataTable } from "@/components/tableComponent/ReusableDataTable";
import { useGetSubjects } from "@/hooks/useGetSubjects";
import { useUserAuth } from "@/hooks/useUserAuth";

const ClassPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);

  const query = useGetSubjects(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between my-8">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست حوزه تدریس درواقع یک دسته بندی برای حوزه درسی میباشد و جزئیات
          بیشتر در لیست دروس مشاهده کنید
        </p>
      </div>
      <ReusableDataTable query={query} columns={SubjectListColumns} >
        {(table) => <SubjectListDataTableViewOptions table={table} />}
      </ReusableDataTable>
    </div>
  );
};
export default ClassPage;
