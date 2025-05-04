import { getUserInfoProps } from "@/actions/dashboardAction";
import { prisma } from "@/lib/db";

type Filter = NonNullable<
  Parameters<typeof prisma.announcement.findMany>[0]
>["where"];

export async function getAnnouncements(user: getUserInfoProps) {
  if (!user) {
    throw new Error("کاربر یافت نشد!");
  }

  const filter = await buildAnnouncementFilter(user);

  const announcements = await prisma.announcement.findMany({
    where: filter,
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      class: { select: { name: true } },
    },
  });

  return announcements.map(mapAnnouncementToDTO);
}

async function buildAnnouncementFilter(
  user: getUserInfoProps
): Promise<Filter> {
  switch (user.role) {
    case "admin":
      return {};

    case "teacher":
      return await getTeacherFilter(user.id);

    case "student":
      return await getStudentFilter(user.id);

    case "parent":
      return await getParentFilter(user.id);

    default:
      return {};
  }
}

async function getTeacherFilter(id: string): Promise<Filter> {
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      lessons: { include: { class: true } },
    },
  });

  if (!teacher) return {};
  const classIds = teacher.lessons
    .filter((lesson) => lesson.class)
    .map((lesson) => lesson.class!.id);

  return {
    OR: [{ classId: { in: classIds } }, { classId: null }],
  };
}

async function getStudentFilter(id: string): Promise<Filter> {
  const student = await prisma.student.findUnique({
    where: { id },
    select: { classId: true },
  });

  if (!student) return {};

  return {
    OR: [{ classId: student.classId }, { classId: null }],
  };
}

async function getParentFilter(id: string): Promise<Filter> {
  const parent = await prisma.parent.findUnique({
    where: { id },
    select: {
      students: { select: { classId: true } },
    },
  });

  if (!parent) return {};

  const classIds = parent.students.map((s) => s.classId);

  return {
    OR: [{ classId: { in: classIds } }, { classId: null }],
  };
}

function mapAnnouncementToDTO(announcement: {
  id: number;
  title: string;
  description: string;
  date: Date;
  class: { name: string } | null;
}) {
  return {
    id: announcement.id,
    title: announcement.title,
    description: announcement.description,
    date: announcement.date,
    className: announcement.class?.name || "عمومی",
  };
}

export type AnnouncementsProps = ReturnType<typeof mapAnnouncementToDTO>;
