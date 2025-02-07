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
  user: {
    name: "admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
          visible: ["admin", "teacher"],
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
          url: "/list/lesson",
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
          title: "خانواده ها",
          visible: ["admin", "teacher", "student", "parent"],
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
          url: "/list/Assignment",
        },
        {
          title: "رویداد ها",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/exam",
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
        },
        {
          title: "تکالیف",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/exam",
        },
        {
          title: "نمرات",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/exam",
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
        },
        {
          title: "لیست غایبین",
          visible: ["admin", "teacher"],
          url: "/list/absent",
        },
        {
          title: "اخرین فعالیت ها",
          visible: ["admin", "teacher"],
          url: "/list/activities",
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
    },
    {
      name: "بهترین 30 روز اخیر",
      visible: ["admin", "teacher"],
      url: "#",
      icon: TrendingUp,
    },
    {
      name: "ضعیف ترین دانش آموزان",
      visible: ["admin", "teacher"],
      url: "#",
      icon: AlertTriangle,
    },
    {
      name: "ضعیف ترین 30 روز اخیر",
      visible: ["admin", "teacher"],
      url: "#",
      icon: TrendingDown,
    },
    {
      name: "امتحانات امروز",
      visible: ["admin"],
      url: "#",
      icon: ClipboardList,
    },
  ],
};

export function DashboardSidebar({
  userInfo,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  userInfo: getUserInfoProps | undefined;
}) {
  return (
    <Sidebar collapsible="icon" {...props} side="right">
      <SidebarHeader>
        <DashboardSidebarSwitcher team={data.team} />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <DashboardSidebarMain items={data.navMain} userInfo={userInfo} />
        <DashboardSidebarOther projects={data.quickAccess} />
      </SidebarContent>
      <SidebarFooter>
        <DashboardSidebarUser user={userInfo} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
