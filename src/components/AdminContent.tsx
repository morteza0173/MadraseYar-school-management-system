import {
  getAdmins,
  getEvents,
  getStudents,
  getTeacher,
  getUserInfo,
} from "@/actions/dashboardAction";
import { Announcements } from "@/components/Announcements";
import { Barchart } from "@/components/BarChart";
import { EventCard } from "@/components/EventCard";
import { LineChartLable } from "@/components/LineChartLable";
import { RadialChart } from "@/components/RadialChart";
import UserCard from "@/components/UserCard";
import { redirect } from "next/navigation";
import { DatePicker } from "./ClanderDatePicker";

export const AdminContent = async () => {
  const userinfo = await getUserInfo();
  if (userinfo?.role !== "admin") {
    redirect("/login");
  }

  const [students, teacher, admins, events] = await Promise.all([
    getStudents(),
    getTeacher(),
    getAdmins(),
    getEvents(),
  ]);

  return (
    <div className="p-4 flex gap-4 flex-col lg:flex-row  justify-center">
      {/* RIGHT */}
      <div className="w-full lg:w-2/3 max-w-[1060px]">
        {/* USERCARD */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="دانش آموزان" Number={students.length} />
          <UserCard type="معلمان" Number={teacher.length} />
          <UserCard type="مدیریت" Number={admins.length} />
          <UserCard type="رویداد ها" Number={events.length} />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col mt-4 xl:flex-row w-auto justify-center">
          {/* count Chart */}
          <div className="w-full xl:w-[33%] h-[300px] xl:h-[450px]">
            <RadialChart />
          </div>
          {/* chart hozor */}
          <div className="w-full xl:w-[64%] h-[450px] xl:h-[450px]">
            <Barchart />
          </div>
        </div>

        {/* BOTTOM CHARTS */}
        <div className="-my-8 xl:my-4">
          <LineChartLable />
        </div>
      </div>
      {/* LEFT */}
      <div className="w-full lg:w-1/3 h-full xl:max-w-[530px]">
        <div className="w-full flex flex-col md:flex-row lg:flex-col gap-4">
          {/* datepicker */}
          <div className="md:h-[380px] lg:h-auto  mt-10 lg:mt-0">
              <DatePicker />
          </div>
          <div className="w-full h-auto md:mt-10 lg:mt-0">
            <EventCard />
          </div>
        </div>
        <div className="mt-4">
          <Announcements />
        </div>
      </div>
    </div>
  );
};
