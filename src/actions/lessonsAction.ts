"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getLessonsData(userId: string) {
  const dayTranslations: Record<string, string> = {
    SATURDAY: "شنبه",
    SUNDAY: "یکشنبه",
    MONDAY: "دوشنبه",
    TUESDAY: "سه‌شنبه",
    WEDNESDAY: "چهارشنبه",
  };

  // بررسی نقش ادمین
  const admin = await prisma.admin.findUnique({ where: { id: userId } });

  if (admin) {
    return await prisma.lesson
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
          }),
          endTime: new Date(lesson.endTime).toLocaleTimeString("en", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          teacher: {
            id: lesson.teacher.id,
            name: `${lesson.teacher.name} ${lesson.teacher.surname}`,
          },
        }))
      );
  }

  // بررسی نقش معلم
  const teacher = await prisma.teacher.findUnique({ where: { id: userId } });
  if (teacher) {
    return await prisma.lesson
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
          }),
          endTime: new Date(lesson.endTime).toLocaleTimeString("en", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          teacher: {
            id: lesson.teacher.id,
            name: `${lesson.teacher.name} ${lesson.teacher.surname}`,
          },
        }))
      );
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
    return student.class.lessons.map((lesson) => ({
      lessonId: lesson.id,
      lessonName: lesson.name,
      subjectName: lesson.subject.name,
      className: student.class.name,
      day: dayTranslations[lesson.day],
      startTime: new Date(lesson.startTime).toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      endTime: new Date(lesson.endTime).toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      teacher: {
        id: lesson.teacher.id,
        name: `${lesson.teacher.name} ${lesson.teacher.surname}`,
      },
    }));
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
        }),
        endTime: new Date(lesson.endTime).toLocaleTimeString("en", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
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

    return uniqueLessons;
  }

  throw new Error("کاربر نقش مشخصی ندارد");
}

export async function AddLesson(data: Prisma.LessonCreateInput) {
  try {
    await prisma.lesson.create({ data });
    return {
      message: "درس جدید با موفقیت ایجاد شد و به برنامه هفتگی افزوده شد",
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function EditLesson({
  data,
  id,
}: {
  data: Prisma.LessonUpdateInput;
  id: number;
}) {
  try {
    await prisma.lesson.update({
      where: { id },
      data,
    });
    return {
      message: "درس با موفقیت ویرایش شد",
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function DeleteLesson(formData: FormData) {
  const id = formData.get("id");
  const idNumber = Number(id);
  try {
    await prisma.lesson.delete({
      where: { id: idNumber },
    });
    return {
      message: "درس با موفقیت حذف شد",
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function DeleteLessons(ids: number[]) {
  try {
    await prisma.lesson.deleteMany({
      where: { id: { in: ids } },
    });
    return {
      message: "درس‌ها با موفقیت حذف شدند",
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}
