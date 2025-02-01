"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  GraduationCap,
  Map,
  PieChart,
  Settings2,
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
      title: "لیست ها",
      visible: ["admin", "teacher", "student", "parent"],
      url: "#",
      icon: Bot,
      items: [
        {
          title: "دوره تحصیلی",
          visible: ["admin", "teacher"],
          url: "/list/grade",
        },
        {
          title: "کلاس ها",
          visible: ["admin", "teacher", "parent"],
          url: "/list/class",
        },
        {
          title: "درس ها",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/lesson",
        },
        {
          title: "دانش آموزان",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/student",
        },
        {
          title: "معلم ها",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/teacher",
        },
        {
          title: "خانواده ها",
          visible: ["admin", "teacher"],
          url: "/list/parent",
        },
      ],
    },
    {
      title: "فعالیت ها",
      visible: ["admin", "teacher", "student", "parent"],
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "تکالیف",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/Assignment",
        },
        {
          title: "امتحانات",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/exam",
        },
        {
          title: "نتایج",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/result",
        },
        {
          title: "بهترین ها",
          visible: ["admin", "teacher", "student", "parent"],
          url: "/list/best",
        },
      ],
    },
    {
      title: "مدیریت",
      visible: ["admin", "teacher"],
      url: "#",
      icon: Settings2,
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
        {
          title: "رویداد ها",
          visible: ["admin", "teacher"],
          url: "/list/event",
        },
        {
          title: "اعلامیه ها",
          visible: ["admin", "teacher"],
          url: "/list/event",
        },
      ],
    },
  ],
  projects: [
    {
      name: "افزودن معلم",
      visible: ["admin"],
      url: "#",
      icon: Frame,
    },
    {
      name: "افزودن دانش آموز",
      visible: ["admin"],
      url: "#",
      icon: PieChart,
    },
    {
      name: "رویداد جدید",
      visible: ["admin", "teacher"],
      url: "#",
      icon: Map,
    },
    {
      name: "اعلامیه جدید",
      visible: ["admin", "teacher"],
      url: "#",
      icon: Map,
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
        <DashboardSidebarOther projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <DashboardSidebarUser user={userInfo} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
