"use client";

import { Announcements } from "@/components/Announcements";
import { Barchart } from "@/components/BarChart";
import { DatePicker } from "@/components/ClanderDatePicker";
import { EventCard } from "@/components/EventCard";
import { LineChartLable } from "@/components/LineChartLable";
import { RadialChart } from "@/components/RadialChart";
import UserCard from "@/components/UserCard";
import useGetAdmins from "@/hooks/useGetAdmins";
import useGetAnnouncementsData from "@/hooks/useGetAnnouncementsData";
import useGetClassDetails from "@/hooks/useGetClassDetails";
import useGetStudents from "@/hooks/useGetStudents";
import useGetTeacher from "@/hooks/useGetTeacher";
import { useUserAuth } from "@/hooks/useUserAuth";
import { BookOpenText, CalendarDays, GraduationCap, User } from "lucide-react";

const AdminPage = () => {
  const { userData } = useUserAuth(["admin"]);

  const { studentData, isStudentPending } = useGetStudents();
  const { teacherData, isTeacherPending } = useGetTeacher();
  const { adminData, isAdminPending } = useGetAdmins();
  const { ClassData, isClassPending } = useGetClassDetails(userData);
   const {
     isAnnouncementsPending,
     announcementsData,
   } = useGetAnnouncementsData(userData);


 const maleCount =
   studentData?.filter((student) => student.sex === "MALE").length || 0;
 const femaleCount =
   studentData?.filter((student) => student.sex === "FEMALE").length || 0;



  return (
    <div className="p-4 flex gap-4 flex-col lg:flex-row  justify-center">
      {/* RIGHT */}
      <div className="w-full lg:w-2/3 max-w-[1060px]">
        {/* USERCARD */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard
            type="دانش آموزان"
            Number={studentData?.length}
            pending={isStudentPending}
            icon={<GraduationCap size={25} strokeWidth={1} />}
          />
          <UserCard
            type="معلمان"
            Number={teacherData?.length}
            pending={isTeacherPending}
            icon={<User size={25} strokeWidth={1} />}
          />
          <UserCard
            type="تعداد کلاس ها"
            Number={ClassData?.length}
            pending={isClassPending}
            icon={<BookOpenText size={25} strokeWidth={1} />}
          />
          <UserCard
            type="رویداد های پیش رو"
            Number={adminData?.length}
            pending={isAdminPending}
            icon={<CalendarDays size={25} strokeWidth={1} />}
          />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col mt-4 xl:flex-row w-auto justify-center">
          {/* count Chart */}
          <div className="w-full xl:w-[33%] h-[300px] xl:h-[450px]">
            <RadialChart
              maleCount={maleCount}
              femaleCount={femaleCount}
              isStudentPending={isStudentPending}
            />
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
          <Announcements
            announcementsData={announcementsData}
            isAnnouncementsPending={isAnnouncementsPending}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
