import { getUserInfoProps } from "@/actions/dashboardAction";
import { prisma } from "@/lib/db";

type EventFilter = NonNullable<
  Parameters<typeof prisma.event.findMany>[0]
>["where"];

export async function getEvents(user: getUserInfoProps) {
  if (!user) throw new Error("کاربر یافت نشد!");

  const filter: EventFilter = await buildEventFilter(user);

  const events = await prisma.event.findMany({
    where: filter,
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      startTime: true,
      endTime: true,
      class: { select: { name: true } },
    },
  });

  return events.map(mapEventToDTO);
}

export async function buildEventFilter(
  user: getUserInfoProps
): Promise<EventFilter> {
  switch (user.role) {
    case "admin":
      return {};

    case "teacher":
      return await getTeacherEventFilter(user.id);

    case "student":
      return await getStudentEventFilter(user.id);

    case "parent":
      return await getParentEventFilter(user.id);

    default:
      return { id: { in: [] } }; // فیلتر خالی برای نقش نامعتبر
  }
}

async function getTeacherEventFilter(teacherId: string): Promise<EventFilter> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: {
      lessons: { select: { classId: true } },
    },
  });

  if (!teacher) return {};

  const classIds = teacher.lessons.map((lesson) => lesson.classId);
  return {
    OR: [{ classId: null }, { classId: { in: classIds } }],
  };
}

async function getStudentEventFilter(studentId: string): Promise<EventFilter> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { classId: true },
  });

  if (!student) return {};

  return {
    OR: [{ classId: null }, { classId: student.classId }],
  };
}

async function getParentEventFilter(parentId: string): Promise<EventFilter> {
  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    select: { students: { select: { classId: true } } },
  });

  if (!parent) return {};

  const classIds = parent.students.map((s) => s.classId);
  return {
    OR: [{ classId: null }, { classId: { in: classIds } }],
  };
}

export function mapEventToDTO(event: {
  id: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  class: { name: string } | null;
}) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
    className: event.class?.name || "عمومی",
  };
}

export type EventsProps = ReturnType<typeof mapEventToDTO>;
