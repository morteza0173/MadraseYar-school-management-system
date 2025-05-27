import { getUserInfoProps } from "@/actions/dashboardAction";
import { prisma } from "@/lib/db";

type AssignmentFilter = NonNullable<
  Parameters<typeof prisma.assignment.findMany>[0]
>["where"];

export async function getAssignments(user: getUserInfoProps) {
  if (!user) throw new Error("کاربر یافت نشد!");

  const filter = await buildAssignmentFilter(user);

  const assignments = await prisma.assignment.findMany({
    where: filter,
    orderBy: { DueDate: "asc" },
    select: {
      id: true,
      title: true,
      DueDate: true,
      StartDate: true,
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

  return assignments.map(mapAssignmentToDTO);
}

async function buildAssignmentFilter(
  user: getUserInfoProps
): Promise<AssignmentFilter> {
  switch (user.role) {
    case "admin":
      return {};

    case "teacher":
      return await getTeacherAssignmentFilter(user.id);

    case "student":
      return await getStudentAssignmentFilter(user.id);

    case "parent":
      return await getParentAssignmentFilter(user.id);

    default:
      return {};
  }
}

async function getTeacherAssignmentFilter(
  teacherId: string
): Promise<AssignmentFilter> {
  const lessons = await prisma.lesson.findMany({
    where: { teacherId },
    select: { id: true },
  });

  const lessonIds = lessons.map((lesson) => lesson.id);

  if (lessonIds.length === 0) return { lessonId: -1 }; // هیچ درسی نداشت

  return { lessonId: { in: lessonIds } };
}

async function getStudentAssignmentFilter(
  studentId: string
): Promise<AssignmentFilter> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { classId: true },
  });

  if (!student) return {};
  return { lesson: { classId: student.classId } };
}

async function getParentAssignmentFilter(
  parentId: string
): Promise<AssignmentFilter> {
  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    select: {
      students: { select: { classId: true } },
    },
  });

  if (!parent) return {};

  const classIds = parent.students.map((student) => student.classId);
  return { lesson: { classId: { in: classIds } } };
}

function mapAssignmentToDTO(assignment: {
  id: number;
  title: string;
  StartDate: Date;
  DueDate: Date;
  lesson: {
    id: number;
    name: string;
    class: {
      id: number;
      name: string;
    } | null;
  } | null;
}) {
  return {
    id: assignment.id,
    title: assignment.title,
    startDate: assignment.StartDate,
    dueDate: assignment.DueDate,
    lessonId: assignment.lesson?.id,
    lessonName: assignment.lesson?.name ?? "نامشخص",
    classId: assignment.lesson?.class?.id,
    className: assignment.lesson?.class?.name ?? "نامشخص",
  };
}

export type AssignmentsProps = ReturnType<typeof mapAssignmentToDTO>;
