import { columns } from "@/components/listTeacher/columns";
import { DataTable } from "@/components/listTeacher/data-table";
import { teacherData } from "@/components/listTeacher/teacherData";

const page = () => {
  const data = teacherData;
  return (
    <div className="h-auto pb-10 flex-1 flex-col px-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست معلمان در جدول زیر نمایش داده میشود
        </p>
      </div>
      <DataTable data={data} columns={columns} />
    </div>
  );
};
export default page;
