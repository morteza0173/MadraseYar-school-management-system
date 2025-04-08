"use client";
import InfoCard from "@/components/InfoCard";
import { EventCard } from "@/components/EventCard";
import StudentCard from "@/components/StudentCard";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { DatePicker } from "@/components/ClanderDatePicker";
import { Announcements } from "@/components/Announcements";
import { useUserAuth } from "@/hooks/useUserAuth";
import useGetAnnouncementsData from "@/hooks/useGetAnnouncementsData";
import { useState } from "react";

const StudentPage = () => {
  const { userData } = useUserAuth(["student"]);
  const { isAnnouncementsPending, announcementsData } =
    useGetAnnouncementsData(userData);
  const [daypickerValue, setDaypickerValue] = useState<Date | undefined>(
    new Date()
  );

  return (
    <div className="p-4 flex gap-4 flex-col lg:flex-row  justify-center">
      {/* RIGHT */}
      <div className="w-full lg:w-2/3 max-w-[1060px] flex flex-col gap-4">
        <div className="w-full flex flex-col xl:flex-row gap-2">
          <div className="w-full xl:w-1/2">
            <StudentCard />
          </div>
          <div className="w-full flex flex-col md:flex-row lg:flex-col gap-1 xl:w-1/2">
            <div className="flex gap-1 w-full h-full ">
              <div className="w-full h-full">
                <InfoCard name="غیبت ها" info={5} icon="attendance" />
              </div>
              <div className="w-full h-full">
                <InfoCard name="تاخیرها" info={5} icon="warning" />
              </div>
            </div>
            <div className="flex  w-full gap-1 h-full">
              <div className="w-full h-full">
                <InfoCard name="اخرین نمره" info={17} icon="lastScore" />
              </div>
              <div className="w-full h-full">
                <InfoCard name="میانگین نمرات" info={16.32} icon="Score" />
              </div>
            </div>
          </div>
        </div>

        <WeeklyCalendar />
      </div>
      {/* LEFT */}
      <div className="w-full lg:w-1/3 h-full xl:max-w-[530px] ">
        <div className="w-full flex flex-col md:flex-row lg:flex-col gap-4">
          {/* datepicker */}
          <div className="md:h-[380px] lg:h-auto  mt-10 lg:mt-0">
            <DatePicker
              setDaypickerValue={setDaypickerValue}
              daypickerValue={daypickerValue}
            />
          </div>
          <div className="w-full h-auto md:mt-10 lg:mt-0">
            <EventCard daypickerValue={daypickerValue} />
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
export default StudentPage;
