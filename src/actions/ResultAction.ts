"use server";

import { prisma } from "@/lib/db";
import { getUserInfoProps } from "./dashboardAction";

export async function getResults(user: getUserInfoProps) {
  if (!user) {
    throw new Error("کاربر یافت نشد!");
  }

  let resultFilter = {};

  if (user.role === "admin") {
    // ادمین همه نمرات را می‌بیند
    resultFilter = {};
  } else if (user.role === "teacher") {
    // معلم فقط نمرات مرتبط با درس‌های خودش را می‌بیند
    const teacher = await prisma.teacher.findUnique({
      where: { id: user.id },
      include: {
        lessons: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!teacher) return [];

    const lessonIds = teacher.lessons.map((lesson) => lesson.id);

    resultFilter = {
      OR: [
        { exam: { lessonId: { in: lessonIds } } }, // نمرات مرتبط با امتحانات درس‌های معلم
        { assignment: { lessonId: { in: lessonIds } } }, // نمرات مرتبط با تکالیف درس‌های معلم
      ],
    };
  } else if (user.role === "student") {
    // دانش‌آموز فقط نمرات خودش را می‌بیند
    resultFilter = {
      studentId: user.id, // نمرات مرتبط با دانش‌آموز
    };
  } else if (user.role === "parent") {
    // والدین فقط نمرات دانش‌آموزان خود را می‌بینند
    const parent = await prisma.parent.findUnique({
      where: { id: user.id },
      include: {
        students: {
          select: { id: true },
        },
      },
    });

    if (!parent) return [];

    const studentIds = parent.students.map((student) => student.id);

    resultFilter = {
      studentId: { in: studentIds }, // نمرات مرتبط با دانش‌آموزان والدین
    };
  }

  const results = await prisma.result.findMany({
    where: resultFilter,
    orderBy: { createdAt: "desc" }, // مرتب‌سازی بر اساس تاریخ ثبت
    select: {
      id: true,
      score: true,
      createdAt: true,
      student: {
        select: {
          id: true,
          name: true,
          surname: true,
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      exam: {
        select: {
          id: true,
          title: true,
          startTime: true,
          lesson: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      assignment: {
        select: {
          id: true,
          title: true,
          DueDate: true,
          lesson: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return results.map((result) => ({
    id: result.id,
    score: result.score,
    createdAt: result.createdAt,
    student: {
      id: result.student.id,
      name: `${result.student.name} ${result.student.surname}`,
    },
    classId: result.student.class?.id || undefined,
    className: result.student.class?.name || "نامشخص",
    type: result.exam ? "امتحان" : "تکلیف",
    relatedId: result.exam?.id || result.assignment?.id,
    relatedTitle: result.exam?.title || result.assignment?.title || "نامشخص",
    relatedDate: result.exam?.startTime || result.assignment?.DueDate,
    lessonId: result.exam?.lesson?.id || result.assignment?.lesson?.id,
    lessonName:
      result.exam?.lesson?.name || result.assignment?.lesson?.name || "نامشخص",
  }));
}
