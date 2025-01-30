import { getClassDetails } from "@/actions/classAction";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getUserInfo } from "@/actions/dashboardAction";
import { redirect } from "next/navigation";

const ClassListContent = async () => {
  const user = await getUserInfo();
  if (!user) {
    redirect("/login");
  }
  const classDetails = await getClassDetails(user);

  return (
    <div className="h-auto pb-10 flex-1 flex-col px-8 md:flex">
      <div className="flex items-center justify-between my-8">
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          لیست تمام کلاس ها در جدول زیر نمایش داده میشود
        </p>
      </div>
      <DataTable data={classDetails} columns={columns} />
    </div>
  );
};
export default ClassListContent;
