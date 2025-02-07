import { getClassDetails } from "@/actions/classAction";
import { ClassListDataTable } from "./ClassListDataTable";
import { classListColumns } from "./classListColumns";
import { getTeacher, getUserInfo } from "@/actions/dashboardAction";
import { redirect } from "next/navigation";
import { GetGradeData } from "@/actions/gradeActions";



const ClassListContent = async () => {
  const user = await getUserInfo();
  if (!user) {
    redirect("/login");
  }

  const [classDetails, teacherList, gradeList] =
    user.role === "admin"
      ? await Promise.all([getClassDetails(user), getTeacher(), GetGradeData()])
      : [await getClassDetails(user), null, null];

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-8 md:flex">
      <div className="flex items-center justify-between my-8">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست تمام کلاس ها در جدول زیر نمایش داده میشود
        </p>
      </div>
      <ClassListDataTable
        data={classDetails}
        teacherList={teacherList}
        gradeList={gradeList}
        columns={classListColumns}
      />
    </div>
  );
};
export default ClassListContent;
