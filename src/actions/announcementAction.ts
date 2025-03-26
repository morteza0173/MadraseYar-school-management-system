"use server";

import { prisma } from "@/lib/db";
import { getUserInfoProps } from "./dashboardAction";

export async function getAnnouncements(user: getUserInfoProps) {
  if (!user) {
    throw new Error("کاربر یافت نشد!");
  }

  let announcementFilter = {};

  if (user.role === "ADMIN") {
    announcementFilter = {};
  } else if (user.role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({
      where: { id: user.id },
      select: { classes: { select: { id: true } } },
    });

    if (!teacher) return [];

    announcementFilter = {
      OR: [
        { classId: { in: teacher.classes.map((cls) => cls.id) } },
        { classId: null },
      ],
    };
  } else if (user.role === "STUDENT") {
    const student = await prisma.student.findUnique({
      where: { id: user.id },
      select: { classId: true },
    });

    if (!student) return [];

    announcementFilter = {
      OR: [{ classId: student.classId }, { classId: null }],
    };
  } else if (user.role === "PARENT") {
    const parent = await prisma.parent.findUnique({
      where: { id: user.id },
      select: {
        students: {
          select: { classId: true },
        },
      },
    });

    if (!parent) return [];

    announcementFilter = {
      OR: [
        { classId: { in: parent.students.map((student) => student.classId) } },
        { classId: null },
      ],
    };
  }

  const announcements = await prisma.announcement.findMany({
    where: announcementFilter,
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      class: {
        select: {
          name: true,
        },
      },
    },
  });

  return announcements.map((announcement) => ({
    id: announcement.id,
    title: announcement.title,
    description: announcement.description,
    date: announcement.date,
    className: announcement.class?.name || "عمومی",
  }));
}
