"use client";
import { TeacherListColumns } from "@/components/listTeacher/TeacherListColumns";
import { TeacherListDataTable } from "@/components/listTeacher/TeacherListDataTable";
import useGetTeacherData from "@/hooks/useGetTeacherData";
import { useUserAuth } from "@/hooks/useUserAuth";

const TeacherDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "strudent", "parent"]);
  const {
    teacherData,
    isTeacherDataError,
    isTeacherDataPending,
    teacherDataRefetch,
  } = useGetTeacherData(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست معلمان در جدول زیر نمایش داده میشود
        </p>
      </div>
      <TeacherListDataTable
        data={teacherData || []}
        columns={TeacherListColumns}
        isTeacherDataError={isTeacherDataError}
        isTeacherDataPending={isTeacherDataPending}
        teacherDataRefetch={teacherDataRefetch}
      />
    </div>
  );
};
export default TeacherDataPage;
