"use client";

import * as React from "react";
import {
  AlertTriangle,
  BookOpen,
  BriefcaseBusiness,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  Medal,
  Megaphone,
  School,
  TrendingDown,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DashboardSidebarMain } from "./DashboardSidebarMain";
import { DashboardSidebarOther } from "./DashboardSidebarOther";
import { DashboardSidebarSwitcher } from "./DashboardSidebarSwitcher";
import { DashboardSidebarUser } from "./DashboardSidebarUser";
import { getUserInfoProps } from "@/actions/dashboardAction";

// This is sample data.
const data = {
  team: {
    name: "مدرسه یار",
    logo: GraduationCap,
    plan: "سال تحصیلی 1403-1404",
  },

  navMain: [
    {
      title: "پایه ها و کلاس ها",
      visible: ["admin", "teacher", "student", "parent"],
      url: "/list/class",
      icon: School,
      items: [
        {
          title: "پایه ها",
          visible: ["admin"],
          url: "/list/grade",
        },
        {
          title: "کلاس ها",
          visible: ["admin", "teacher", "parent"],
          url: "/list/class",
        },
      ],
    },
    {
      title: "آموزش و تدریس",
      visible: ["admin", "teacher", "student", "parent"],
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "حوزه تدریس",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/subject",
        },
        {
          title: "دروس",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/lessons",
        },
        {
          title: "معلم ها",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/teacher",
        },
      ],
    },

    {
      title: "امور دانش آموزی",
      visible: ["admin", "teacher", "student", "parent"],
      url: "#",
      icon: UsersRound,
      items: [
        {
          title: "دانش آموزان",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/student",
        },
        {
          title: "والدین",
          visible: ["admin", "teacher"],
          url: "/list/parent",
        },
      ],
    },
    {
      title: "اطلاع رسانی و رویداد ها",
      visible: ["admin", "teacher", "student", "parent"],
      url: "#",
      icon: Megaphone,
      items: [
        {
          title: "اعلامیه ها",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/announcement",
        },
        {
          title: "رویداد ها",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/event",
        },
      ],
    },
    {
      title: "ارزیابی آموزشی",
      visible: ["admin", "teacher", "student", "parent"],
      url: "#",
      icon: ClipboardCheck,
      items: [
        {
          title: "امتحانات",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/Assignment",
          disabled: true,
        },
        {
          title: "تکالیف",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/exam",
          disabled: true,
        },
        {
          title: "نمرات",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/exam",
          disabled: true,
        },
      ],
    },
    {
      title: "مدیریت",
      visible: ["admin", "teacher"],
      url: "#",
      icon: BriefcaseBusiness,
      items: [
        {
          title: "حضور و غیاب",
          visible: ["admin", "teacher"],
          url: "/list/Attendance",
          disabled: true,
        },
        {
          title: "لیست غایبین",
          visible: ["admin", "teacher"],
          url: "/list/absent",
          disabled: true,
        },
        {
          title: "اخرین فعالیت ها",
          visible: ["admin", "teacher"],
          url: "/list/activities",
          disabled: true,
        },
      ],
    },
  ],
  quickAccess: [
    {
      name: "بهترین دانش آموزان",
      visible: ["admin"],
      url: "#",
      icon: Medal,
      disabled: true,
    },
    {
      name: "بهترین 30 روز اخیر",
      visible: ["admin", "teacher"],
      url: "#",
      icon: TrendingUp,
      disabled: true,
    },
    {
      name: "ضعیف ترین دانش آموزان",
      visible: ["admin", "teacher"],
      url: "#",
      icon: AlertTriangle,
      disabled: true,
    },
    {
      name: "ضعیف ترین 30 روز اخیر",
      visible: ["admin", "teacher"],
      url: "#",
      icon: TrendingDown,
      disabled: true,
    },
    {
      name: "امتحانات امروز",
      visible: ["admin"],
      url: "#",
      icon: ClipboardList,
      disabled: true,
    },
  ],
};

export function DashboardSidebar({
  userInfo,
  isUserPending,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  userInfo: getUserInfoProps | undefined;
  isUserPending: boolean;
}) {
  return (
    <Sidebar collapsible="icon" {...props} side="right">
      <SidebarHeader>
        <DashboardSidebarSwitcher team={data.team} />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <DashboardSidebarMain
          items={data.navMain}
          userInfo={userInfo}
          isUserPending={isUserPending}
        />
        <DashboardSidebarOther projects={data.quickAccess} />
      </SidebarContent>
      <SidebarFooter>
        <DashboardSidebarUser user={userInfo} isUserPending={isUserPending} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
