"use client";

import { LessonsDataTableToolbar } from "@/components/listLessons/LessonsDataTableToolbar";
import { LessonListColumns } from "@/components/listLessons/LessonsListColumns";
import { ReusableDataTable } from "@/components/tableComponent/ReusableDataTable";
import { useGetLessonsData } from "@/hooks/useGetLessonsData";
import { useUserAuth } from "@/hooks/useUserAuth";

const LessonPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);

  const query = useGetLessonsData(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between my-8">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست تمام درس ها و برنامه هفتگی برای هر کلاس در جدول زیر نمایش داده
          میشود
        </p>
      </div>
      <ReusableDataTable
        query={query}
        columns={LessonListColumns}
        mobileVisibility={{
          subjectName: false,
          teacher: false,
          endTime: false,
          className: false,
        }}
        desktopVisibility={{
          subjectName: true,
          teacher: true,
          endTime: true,
          className: true,
        }}
      >
        {(table) => <LessonsDataTableToolbar table={table} />}
      </ReusableDataTable>
    </div>
  );
};
export default LessonPage;
