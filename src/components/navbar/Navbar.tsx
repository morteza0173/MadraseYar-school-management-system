"use client";
import { SidebarTrigger } from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUserAuth } from "@/hooks/useUserAuth";
import { Skeleton } from "../ui/skeleton";
import { usePathname } from "next/navigation";

const routeTitles: Record<string, string> = {
  "/admin": "داشبورد اصلی",
  "/teacher": "داشبورد اصلی معلم",
  "/eventCalendar": "تقویم رویداد ها",
  "/list/grade": "لیست پایه ها",
  "/list/class": "لیست کلاس ها",
  "/list/teacher": "لیست معلمان",
  "/list/student": "لیست دانش آموزان",
  "/list/parent": "لیست والدین",
  "/list/subject": "لیست حوزه های تدریس",
  "/list/lessons": "لیست دروس",
  "/list/attendance": "حضور و غیاب",
  "/list/result": "لیست نمرات",
  "/list/announcement": "لیست اعلانات",
  "/list/assignment": "لیست تکالیف",
  "/list/event": "لیست رویدادها",
  "/list/exam": "لیست امتحانات",
};

const Navbar = () => {
  const { isUserPending, userData } = useUserAuth([
    "admin",
    "teacher",
    "student",
    "parent",
  ]);
  const pathName = usePathname();

  const pageTitle = routeTitles[pathName] || "بدون عنوان";

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex gap-4 items-center">
        <SidebarTrigger />
        <h2 className="font-bold">{pageTitle}</h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-2">
          {isUserPending ? (
            <Skeleton className="h-3 w-16" />
          ) : (
            <span className="text-xs font-medium">{userData?.name}</span>
          )}
          {isUserPending ? (
            <Skeleton className="h-2 w-10" />
          ) : (
            <span className="text-[10px] text-right text-gray-500">
              {userData?.role}
            </span>
          )}
        </div>
        {isUserPending ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : userData?.img ? (
          <Avatar>
            <AvatarImage src={userData?.img} />
          </Avatar>
        ) : (
          <Avatar>
            <AvatarFallback>{userData?.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};
export default Navbar;
