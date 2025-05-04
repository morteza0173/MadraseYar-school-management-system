"use client";

import { LessonListColumns } from "@/components/listLessons/LessonsListColumns";
import { LessonsListDataTable } from "@/components/listLessons/LessonsListDataTable";
import { useGetLessonsData } from "@/hooks/useGetLessonsData";
import { useUserAuth } from "@/hooks/useUserAuth";

const LessonPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);

  const {
    isError: isLessonsError,
    isPending: isLessonsPending,
    data: lessonsData,
    refetch: lessonsRefetch,
  } = useGetLessonsData(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between my-8">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست تمام درس ها و برنامه هفتگی برای هر کلاس در جدول زیر نمایش داده
          میشود
        </p>
      </div>
      <LessonsListDataTable
        isLessonsPending={isLessonsPending}
        isLessonsError={isLessonsError}
        LessonsRefetch={lessonsRefetch}
        data={lessonsData || []}
        columns={LessonListColumns}
      />
    </div>
  );
};
export default LessonPage;
