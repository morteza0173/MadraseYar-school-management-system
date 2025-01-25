import { GetGradeData } from "@/actions/gradeActions";
import { columns } from "@/components/listGrade/columns";
import { DataTable } from "@/components/listGrade/data-table";
const page = async () => {
  const gradeData = await GetGradeData();

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-8 md:flex">
      <div className="flex items-center justify-between my-8">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست سال تحصیلی در جدول زیر نمایش داده میشود
        </p>
      </div>
      <DataTable data={gradeData} columns={columns} />
    </div>
  );
};
export default page;
