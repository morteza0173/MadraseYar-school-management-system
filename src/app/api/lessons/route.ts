import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const dayTranslations: Record<string, string> = {
  SATURDAY: "شنبه",
  SUNDAY: "یکشنبه",
  MONDAY: "دوشنبه",
  TUESDAY: "سه‌شنبه",
  WEDNESDAY: "چهارشنبه",
};

export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = body;
  if (!userId) {
    return NextResponse.json(
      { error: "شناسه کاربر ارسال شده یافت نشد" },
      { status: 400 }
    );
  }

  const admin = await prisma.admin.findUnique({ where: { id: userId } });

  if (admin) {
    const result = await prisma.lesson
      .findMany({
        select: {
          id: true,
          name: true,
          day: true,
          startTime: true,
          endTime: true,
          subject: { select: { name: true } },
          class: { select: { name: true } },
          teacher: { select: { id: true, name: true, surname: true } },
        },
      })
      .then((lessons) =>
        lessons.map((lesson) => ({
          lessonId: lesson.id,
          lessonName: lesson.name,
          subjectName: lesson.subject.name,
          className: lesson.class.name,
          day: dayTranslations[lesson.day],
          startTime: new Date(lesson.startTime).toLocaleTimeString("en", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Tehran",
          }),
          endTime: new Date(lesson.endTime).toLocaleTimeString("en", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Tehran",
          }),
          teacher: {
            id: lesson.teacher.id,
            name: `${lesson.teacher.name} ${lesson.teacher.surname}`,
          },
        }))
      );

    return NextResponse.json(result);
  }

  // بررسی نقش معلم
  const teacher = await prisma.teacher.findUnique({ where: { id: userId } });
  if (teacher) {
    const result = await prisma.lesson
      .findMany({
        where: { teacherId: userId },
        select: {
          id: true,
          name: true,
          day: true,
          startTime: true,
          endTime: true,
          subject: { select: { name: true } },
          class: { select: { name: true } },
          teacher: { select: { id: true, name: true, surname: true } },
        },
      })
      .then((lessons) =>
        lessons.map((lesson) => ({
          lessonId: lesson.id,
          lessonName: lesson.name,
          subjectName: lesson.subject.name,
          className: lesson.class.name,
          day: dayTranslations[lesson.day],
          startTime: new Date(lesson.startTime).toLocaleTimeString("en", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Tehran",
          }),
          endTime: new Date(lesson.endTime).toLocaleTimeString("en", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Tehran",
          }),
          teacher: {
            id: lesson.teacher.id,
            name: `${lesson.teacher.name} ${lesson.teacher.surname}`,
          },
        }))
      );
    return NextResponse.json(result);
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
            },
          },
        },
      },
    },
  });

  if (student) {
    const result = student.class.lessons.map((lesson) => ({
      lessonId: lesson.id,
      lessonName: lesson.name,
      subjectName: lesson.subject.name,
      className: student.class.name,
      day: dayTranslations[lesson.day],
      startTime: new Date(lesson.startTime).toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Tehran",
      }),
      endTime: new Date(lesson.endTime).toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Tehran",
      }),
      teacher: {
        id: lesson.teacher.id,
        name: `${lesson.teacher.name} ${lesson.teacher.surname}`,
      },
    }));
    return NextResponse.json(result);
  }

  // بررسی نقش والد
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
                },
              },
            },
          },
        },
      },
    },
  });

  if (parent) {
    const lessons = parent.students.flatMap((student) =>
      student.class.lessons.map((lesson) => ({
        lessonId: lesson.id,
        lessonName: lesson.name,
        subjectName: lesson.subject.name,
        className: student.class.name,
        day: dayTranslations[lesson.day],
        startTime: new Date(lesson.startTime).toLocaleTimeString("en", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Tehran",
        }),
        endTime: new Date(lesson.endTime).toLocaleTimeString("en", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Tehran",
        }),
        teacher: {
          id: lesson.teacher.id,
          name: `${lesson.teacher.name} ${lesson.teacher.surname}`,
        },
      }))
    );

    // حذف درس‌های تکراری بر اساس نام سابجکت و کلاس
    const uniqueLessons = Array.from(
      new Map(
        lessons.map((lesson) => [
          `${lesson.subjectName}-${lesson.className}`,
          lesson,
        ])
      ).values()
    );

    return NextResponse.json(uniqueLessons);
  }

  throw new Error("کاربر نقش مشخصی ندارد");
}
