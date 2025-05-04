import { getUserInfoProps } from "@/actions/dashboardAction";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getLessons(user: getUserInfoProps) {
  if (!user) throw new Error("کاربر یافت نشد!");

  const lessons = await prisma.lesson.findMany({
    where: await buildLessonFilter(user),
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
  });

  return lessons.map(mapLessonToDTO);
}

export type LessonWhereInput = Prisma.LessonWhereInput;

export async function buildLessonFilter(
  user: getUserInfoProps
): Promise<LessonWhereInput> {
  switch (user.role) {
    case "admin":
      return {};

    case "teacher":
      return { teacherId: user.id };

    case "student": {
      const student = await prisma.student.findUnique({
        where: { id: user.id },
        select: { classId: true },
      });
      if (!student) return {};
      return { classId: student.classId };
    }

    case "parent": {
      const parent = await prisma.parent.findUnique({
        where: { id: user.id },
        select: {
          students: { select: { classId: true } },
        },
      });
      if (!parent) return {};

      const classIds = parent.students.map((s) => s.classId);
      return { classId: { in: classIds } };
    }

    default:
      return { id: { in: [] } };
  }
}

const dayTranslations: Record<string, string> = {
  SATURDAY: "شنبه",
  SUNDAY: "یکشنبه",
  MONDAY: "دوشنبه",
  TUESDAY: "سه‌شنبه",
  WEDNESDAY: "چهارشنبه",
};

export function mapLessonToDTO(lesson: {
  id: number;
  name: string;
  day: string;
  startTime: Date;
  endTime: Date;
  subject: { name: string };
  class: { name: string };
  teacher: { id: string; name: string; surname: string };
}) {
  return {
    lessonId: lesson.id,
    lessonName: lesson.name,
    subjectName: lesson.subject.name,
    className: lesson.class.name,
    day: dayTranslations[lesson.day] || lesson.day,
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
  };
}


export type getLessonsProps = ReturnType<typeof mapLessonToDTO>;
