import { getUserInfoProps } from "@/actions/dashboardAction";
import { prisma } from "@/lib/db";

type ExamFilter = NonNullable<
  Parameters<typeof prisma.exam.findMany>[0]
>["where"];

export async function getExams(user: getUserInfoProps) {
  if (!user) throw new Error("کاربر یافت نشد!");

  const filter: ExamFilter = await buildExamFilter(user);

  const exams = await prisma.exam.findMany({
    where: filter,
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      title: true,
      startTime: true,
      endTime: true,
      lesson: {
        select: {
          id: true,
          name: true,
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return exams.map(mapExamToDTO);
}

export async function buildExamFilter(
  user: getUserInfoProps
): Promise<ExamFilter> {
  switch (user.role) {
    case "admin":
      return {};

    case "teacher":
      return await getTeacherExamFilter(user.id);

    case "student":
      return await getStudentExamFilter(user.id);

    case "parent":
      return await getParentExamFilter(user.id);

    default:
      return { id: { in: [] } };
  }
}

async function getTeacherExamFilter(teacherId: string): Promise<ExamFilter> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: {
      lessons: { select: { classId: true } },
    },
  });

  if (!teacher) return {};

  const classIds = teacher.lessons.map((l) => l.classId);

  return {
    OR: [
      { lesson: { classId: undefined } }, // عمومی
      { lesson: { classId: { in: classIds } } }, // مربوط به کلاس‌های معلم
    ],
  };
}

async function getStudentExamFilter(studentId: string): Promise<ExamFilter> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { classId: true },
  });

  if (!student) return {};

  return {
    OR: [
      { lesson: { classId: undefined } },
      { lesson: { classId: student.classId } },
    ],
  };
}

async function getParentExamFilter(parentId: string): Promise<ExamFilter> {
  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    select: {
      students: { select: { classId: true } },
    },
  });

  if (!parent) return {};

  const classIds = parent.students.map((s) => s.classId);

  return {
    OR: [
      { lesson: { classId: undefined } },
      { lesson: { classId: { in: classIds } } },
    ],
  };
}

export function mapExamToDTO(exam: {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  lesson: {
    id: number | null;
    name: string | null;
    class: {
      id: number;
      name: string;
    } | null;
  } | null;
}) {
  return {
    id: exam.id,
    title: exam.title,
    startTime: exam.startTime,
    endTime: exam.endTime,
    lessonId: exam.lesson?.id || undefined,
    lessonName: exam.lesson?.name || "نامشخص",
    classId: exam.lesson?.class?.id || undefined,
    className: exam.lesson?.class?.name || "نامشخص",
  };
}


export type ExamsProps = {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  lessonName: string;
  className: string;
  lessonId?: number | undefined;
  classId?: number | undefined;
};


