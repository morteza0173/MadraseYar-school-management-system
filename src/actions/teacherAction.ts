"use server";

import { prisma } from "@/lib/db";

interface FormattedTeacher {
  id: string;
  label: {
    name: string;
    email?: string;
    img?: string;
  };
  phone?: string;
  subject?: string;
  classes: string;
  eventOnGoing: number;
}

export async function getTeacherData(userId: string) {
  const now = new Date();

  // بررسی نقش ادمین و معلم
  const admin = await prisma.admin.findUnique({ where: { id: userId } });
  const teacherUser = await prisma.teacher.findUnique({
    where: { id: userId },
  });

  const classes = await prisma.class.findMany({
    select: { id: true, name: true },
  });

  if (admin || teacherUser) {
    // دسترسی کامل برای ادمین و معلم
    const teachers = await prisma.teacher.findMany({
      include: {
        subjects: true,
        classes: true,
        lessons: {
          include: {
            assignment: true,
            exams: true,
          },
        },
      },
    });

    const classMap = new Map(classes.map((cls) => [cls.id, cls.name]));


    const formatted = teachers.map((t) => {
      let upcomingAssignments = 0;
      let upcomingExams = 0;

      const classSet = new Set();

      t.lessons.forEach((lesson) => {
        if (lesson.classId && classMap.has(lesson.classId)) {
          classSet.add(classMap.get(lesson.classId));
        }

        upcomingAssignments += lesson.assignment.filter(
          (assignment) => new Date(assignment.DueDate) > now
        ).length;
        upcomingExams += lesson.exams.filter(
          (exam) => new Date(exam.startTime) > now
        ).length;
      });

      return {
        id: t.id,
        label: {
          name: `${t.name} ${t.surname}`,
          email: t.email || undefined,
          img: t.img || undefined,
        },
        phone: t.phone || undefined,
        subject: t.subjects[0]?.name || "ندارد",
        classes: Array.from(classSet).join(" , "),
        eventOnGoing: upcomingAssignments + upcomingExams,
      };
    });
    return formatted;
  }

  // بررسی نقش دانش‌آموز
  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      class: {
        include: {
          lessons: {
            include: {
              subject: true,
              teacher: true,
              assignment: true,
              exams: true,
            },
          },
        },
      },
    },
  });
  if (student) {
    // برای دانش‌آموز: تنها معلم‌های کلاس دانش‌آموز
    const lessons = student.class.lessons;
    const teacherMap: Record<string, FormattedTeacher> = {};

    lessons.forEach((lesson) => {
      const t = lesson.teacher;
      if (!teacherMap[t.id]) {
        teacherMap[t.id] = {
          id: t.id,
          label: {
            name: `${t.name} ${t.surname}`,
            email: t.email || undefined,
            img: t.img || undefined,
          },
          phone: t.phone || undefined,
          subject: lesson.subject?.name || "ندارد",
          classes: student.class.name,
          eventOnGoing: 0,
        };
      }
      teacherMap[t.id].eventOnGoing +=
        lesson.assignment.filter(
          (assignment) => new Date(assignment.DueDate) > now
        ).length +
        lesson.exams.filter((exam) => new Date(exam.startTime) > now).length;
    });
    return Object.values(teacherMap);
  }

  // بررسی نقش والد (خانوار)
  const parent = await prisma.parent.findUnique({
    where: { id: userId },
    include: {
      students: {
        include: {
          class: {
            include: {
              lessons: {
                include: {
                  subject: true,
                  teacher: true,
                  assignment: true,
                  exams: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (parent) {
    // برای خانوار: تنها معلم‌های فرزندان
    const teacherMap: Record<string, FormattedTeacher> = {};

    parent.students.forEach((student) => {
      student.class.lessons.forEach((lesson) => {
        const t = lesson.teacher;
        if (!teacherMap[t.id]) {
          teacherMap[t.id] = {
            id: t.id,
            label: {
              name: `${t.name} ${t.surname}`,
              email: t.email || undefined,
              img: t.img || undefined,
            },
            phone: t.phone || undefined,
            subject: lesson.subject?.name || "ندارد",
            classes: student.class.name,
            eventOnGoing: 0,
          };
        }
        teacherMap[t.id].eventOnGoing +=
          lesson.assignment.filter(
            (assignment) => new Date(assignment.DueDate) > now
          ).length +
          lesson.exams.filter((exam) => new Date(exam.startTime) > now).length;
      });
    });
    return Object.values(teacherMap);
  }

  // در صورت عدم تطابق نقش، آرایه خالی برگردانده می‌شود
  return [];
}
