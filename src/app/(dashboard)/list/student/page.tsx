"use client";

import { StudentListColumns } from "@/components/listStudent/StudentListColumns";
import { StudentListDataTable } from "@/components/listStudent/StudentListDataTable";
import useGetStudentData from "@/hooks/useGetStudentData";
import { useUserAuth } from "@/hooks/useUserAuth";

const StudentDataPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "strudent", "parent"]);
  const {
    studentData,
    isStudentDataPending,
    isStudentDataError,
    studentDataRefetch,
  } = useGetStudentData(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست دانش‌آموزان در جدول زیر نمایش داده میشود
        </p>
      </div>
      <StudentListDataTable
        data={studentData || []}
        columns={StudentListColumns}
        isStudentDataError={isStudentDataError}
        isStudentDataPending={isStudentDataPending}
        studentDataRefetch={studentDataRefetch}
      />
    </div>
  );
};
export default StudentDataPage;
