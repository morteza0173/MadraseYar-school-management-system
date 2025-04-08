"use client";
import InfoCard from "@/components/InfoCard";
import { EventCard } from "@/components/EventCard";
import TeacherCard from "@/components/TeacherCard";
import { DatePicker } from "@/components/ClanderDatePicker";
import { useUserAuth } from "@/hooks/useUserAuth";
import useGetTeacherData from "@/hooks/useGetTeacherData";
import { useEffect, useState } from "react";
import { FormattedTeacher } from "@/actions/teacherAction";
import useGetClassDetails from "@/hooks/useGetClassDetails";
import WeeklyCalendarTeacher from "@/components/WeeklyCalendarTeacher";
import { Announcements } from "@/components/Announcements";
import useGetAnnouncementsData from "@/hooks/useGetAnnouncementsData";

const TeacherPage = () => {
  const { userData } = useUserAuth(["teacher"]);
  const { isTeacherDataError, teacherData } = useGetTeacherData(userData);
  const { ClassData, isClassError } = useGetClassDetails(userData);
  const { isAnnouncementsPending, announcementsData } =
    useGetAnnouncementsData(userData);

  const [teacherInfo, setTeacherInfo] = useState<
    FormattedTeacher | undefined
  >();
  const [totalStudents, setTotalStudents] = useState<number | null>(null);

  const [classCount, setClassCount] = useState<number | null>(null);
  const [daypickerValue, setDaypickerValue] = useState<Date | undefined>(
    new Date()
  );

  useEffect(() => {
    const teacherInfoData = teacherData?.find(
      (teacher) => teacher.id === userData?.id
    );

    setTeacherInfo(teacherInfoData);

    if (teacherInfo) {
      if (teacherInfo.classes) {
        const classes = teacherInfo.classes.split(",");

        const classCount = classes.length;
        setClassCount(classCount);
      } else {
        setClassCount(0);
      }
    }

    if (teacherInfo && ClassData) {
      const classes = teacherInfo.classes.split(",").map((cls) => cls.trim());
      const classDetails = ClassData.filter((cls) =>
        classes.includes(cls.name)
      );

      const totalStudents = classDetails.reduce(
        (sum, cls) => sum + Number(cls.studentCount),
        0
      );
      setTotalStudents(totalStudents);
    }
  }, [teacherData, userData, ClassData, classCount, teacherInfo]);

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row  justify-center">
      {/* RIGHT */}
      <div className="w-full xl:w-2/3 max-w-[1060px] flex flex-col gap-4">
        <div className="w-full flex flex-col xl:flex-row gap-2">
          <div className="w-full xl:w-1/2">
            <TeacherCard control="teacher" />
          </div>
          <div className="w-full flex flex-col md:flex-row lg:flex-col gap-1 xl:w-1/2">
            <div className="flex gap-1 w-full h-full ">
              <div className="w-full h-full">
                <InfoCard
                  name="تعداد دانش آموزان"
                  info={totalStudents}
                  icon="attendance"
                  error={isTeacherDataError || isClassError}
                />
              </div>
              <div className="w-full h-full">
                <InfoCard name="تکالیف پیش رو" info={0} icon="Score" />
              </div>
            </div>
            <div className="flex  w-full gap-1 h-full">
              <div className="w-full h-full">
                <InfoCard name="امتحانات پیش رو" info={0} icon="lastScore" />
              </div>
              <div className="w-full h-full">
                <InfoCard
                  name="تعداد کلاس ها"
                  info={classCount}
                  icon="classCount"
                  error={isTeacherDataError}
                />
              </div>
            </div>
          </div>
        </div>

        <WeeklyCalendarTeacher />
      </div>
      {/* LEFT */}
      <div className="w-full xl:w-1/3 h-full xl:max-w-[530px] ">
        <div className="w-full flex flex-col md:flex-row lg:flex-col gap-4">
          {/* datepicker */}
          <DatePicker
            setDaypickerValue={setDaypickerValue}
            daypickerValue={daypickerValue}
          />
          <div className="w-full h-auto ">
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
export default TeacherPage;
