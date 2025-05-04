import { getUserInfoProps } from "@/actions/dashboardAction";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getResults(user: getUserInfoProps) {
  if (!user) throw new Error("کاربر یافت نشد!");

  const where = await buildResultFilter(user);

  const results = await prisma.result.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: resultSelect,
  });

  return results.map(mapResultToDTO);
}

export const resultSelect = {
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
};

export type ResultWithRelations = Prisma.ResultGetPayload<{
  select: typeof resultSelect;
}>;

export function mapResultToDTO(result: ResultWithRelations) {
  return {
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
  };
}

export async function buildResultFilter(
  user: getUserInfoProps
): Promise<Prisma.ResultWhereInput> {
  const strategies: Record<
    string,
    (user: getUserInfoProps) => Promise<Prisma.ResultWhereInput>
  > = {
    admin: buildAdminFilter,
    teacher: buildTeacherFilter,
    student: buildStudentFilter,
    parent: buildParentFilter,
  };

  const strategy = strategies[user.role];
  if (!strategy) return { id: { in: [] } };

  return await strategy(user);
}

export async function buildAdminFilter(): Promise<Prisma.ResultWhereInput> {
  return {}; // همه نمرات
}

export async function buildTeacherFilter(
  user: getUserInfoProps
): Promise<Prisma.ResultWhereInput> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: user.id },
    include: {
      lessons: { select: { id: true } },
    },
  });

  if (!teacher) return { id: { in: [] } };

  const lessonIds = teacher.lessons.map((l) => l.id);

  return {
    OR: [
      { exam: { lessonId: { in: lessonIds } } },
      { assignment: { lessonId: { in: lessonIds } } },
    ],
  };
}

export async function buildStudentFilter(
  user: getUserInfoProps
): Promise<Prisma.ResultWhereInput> {
  return { studentId: user.id };
}

export async function buildParentFilter(
  user: getUserInfoProps
): Promise<Prisma.ResultWhereInput> {
  const parent = await prisma.parent.findUnique({
    where: { id: user.id },
    include: {
      students: { select: { id: true } },
    },
  });

  if (!parent) return { id: { in: [] } };

  const studentIds = parent.students.map((s) => s.id);
  return { studentId: { in: studentIds } };
}

export type ResultProps = ReturnType<typeof mapResultToDTO>;
