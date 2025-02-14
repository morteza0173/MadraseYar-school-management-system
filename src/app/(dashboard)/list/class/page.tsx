"use client";
import { classListColumns } from "@/components/ClassList/classListColumns";
import { ClassListDataTable } from "@/components/ClassList/ClassListDataTable";
import useGetClassDetails from "@/hooks/useGetClassDetails";
import useGetGradeData from "@/hooks/useGetGradeData";
import useGetTeacher from "@/hooks/useGetTeacher";
import { useUserAuth } from "@/hooks/useUserAuth";

const ClassPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);

  const { ClassData, classRefetch, isClassError, isClassPending } =
    useGetClassDetails(userData);

  const { isTeacherError, isTeacherPending, teacherData, teacherRefetch } =
    useGetTeacher();

  const { gradeData, gradeRefetch, isGradeError, isGradePending } =
    useGetGradeData();

  // const [classDetails, teacherList, gradeList] =
  //   user.role === "admin"
  //     ? await Promise.all([getClassDetails(user), getTeacher(), GetGradeData()])
  //     : [await getClassDetails(user), null, null];

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-8 md:flex">
      <div className="flex items-center justify-between my-8">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست تمام کلاس ها در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ClassListDataTable
        isClassPending={isClassPending}
        isClassError={isClassError}
        ClassRefetch={classRefetch}
        isTeacherPending={isTeacherPending}
        isTeacherError={isTeacherError}
        teacherRefetch={teacherRefetch}
        isGradePending={isGradePending}
        isGradeError={isGradeError}
        gradeRefetch={gradeRefetch}
        data={ClassData || []}
        teacherList={teacherData || []}
        gradeList={gradeData || []}
        columns={classListColumns}
      />
    </div>
  );
};
export default ClassPage;
