import { GetGradeData } from "@/actions/gradeActions";
import { GradeListDataTable } from "./GradeListDataTable";
import { getUserInfo } from "@/actions/dashboardAction";
import { redirect } from "next/navigation";
import { gradeListColumns } from "./gradeListColumns";

const GradeListContent = async () => {
  const user = await getUserInfo();
  if (user?.role !== "admin") {
    redirect("/login");
  }

  const gradeData = await GetGradeData();

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-8 md:flex">
      <div className="flex items-center justify-between my-8">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست سال تحصیلی در جدول زیر نمایش داده میشود
        </p>
      </div>
      <GradeListDataTable data={gradeData} columns={gradeListColumns} />
    </div>
  );
};
export default GradeListContent;
