"use client";

import { SubjectListColumns } from "@/components/listSubject/SubjectListColumns";
import { SubjectListDataTable } from "@/components/listSubject/SubjectListDataTable";
import useGetSubjects from "@/hooks/useGetSubjects";
import { useUserAuth } from "@/hooks/useUserAuth";

const ClassPage = () => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);

  const { isSubjectError, subjectRefetch, subjectData, isSubjectPending } =
    useGetSubjects(userData);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-1 md:px-4 lg:px-8 md:flex">
      <div className="flex items-center justify-between my-8">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست حوزه تدریس درواقع یک دسته بندی برای حوزه درسی میباشد و جزئیات
          بیشتر در لیست دروس مشاهده کنید
        </p>
      </div>
      <SubjectListDataTable
        isSubjectPending={isSubjectPending}
        isSubjectError={isSubjectError}
        SubjectRefetch={subjectRefetch}
        data={subjectData || []}
        columns={SubjectListColumns}
      />
    </div>
  );
};
export default ClassPage;
