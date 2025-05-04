import { getUserInfoProps } from "@/actions/dashboardAction";
import { prisma } from "@/lib/db";

type ClassFilter = NonNullable<
  Parameters<typeof prisma.class.findMany>[0]
>["where"];

export async function getClassDetails(user: getUserInfoProps) {
  if (!user) {
    throw new Error("کاربر یافت نشد!");
  }

  const filter = await buildClassFilter(user);

  const classDetails = await prisma.class.findMany({
    where: filter,
    orderBy: { grade: { level: "asc" } },
    select: {
      name: true,
      grade: { select: { level: true } },
      capacity: true,
      student: { select: { id: true } },
      supervisor: { select: { name: true, surname: true } },
    },
  });

  return classDetails.map(mapClassToDTO);
}


async function buildClassFilter(user: getUserInfoProps): Promise<ClassFilter> {
  switch (user.role) {
    case "admin":
      return {};
    case "teacher":
      return await getTeacherClassFilter(user.id);
    case "student":
      return await getStudentClassFilter(user.id);
    case "parent":
      return await getParentClassFilter(user.id);
    default:
      throw new Error("نقش نامعتبر است!");
  }
}

async function getTeacherClassFilter(teacherId: string): Promise<ClassFilter> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: {
      lessons: { include: { class: true } },
    },
  });

  if (!teacher) return {};

  const classIds = teacher.lessons
    .filter((lesson) => lesson.class !== null)
    .map((lesson) => lesson.class!.id);

  return { id: { in: classIds } };
}

async function getParentClassFilter(parentId: string): Promise<ClassFilter> {
  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    select: {
      students: { select: { classId: true } },
    },
  });

  if (!parent) return {};

  const classIds = parent.students.map((s) => s.classId);
  return { id: { in: classIds } };
}

async function getStudentClassFilter(studentId: string): Promise<ClassFilter> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { classId: true },
  });

  if (!student) return {};

  return { id: student.classId };
}


function mapClassToDTO(cls: {
  name: string;
  grade: { level: number };
  capacity: number;
  student: { id: string }[];
  supervisor: { name: string; surname: string } | null;
}) {
  return {
    name: cls.name,
    grade: cls.grade.level,
    capacity: cls.capacity,
    studentCount: cls.student.length,
    supervisor: cls.supervisor
      ? `${cls.supervisor.name} ${cls.supervisor.surname}`
      : "بدون مشاور",
  };
}

export type ClassDetailsProps = ReturnType<typeof mapClassToDTO>;
