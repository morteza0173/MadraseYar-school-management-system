import { prisma } from "@/lib/db";

export interface SubjectDataProps {
  name: string;
  teacherCount: number;
  lessonCount: number;
}

interface SubjectWithRelations {
  id: number;
  name: string;
  teachers: { id: string }[];
  lessons: { id: number }[];
}

export async function getSubjectsData(userId: string): Promise<SubjectDataProps[]> {
  if (await prisma.admin.findUnique({ where: { id: userId } })) {
    return getSubjectsForAdminOrTeacher();
  }

  if (await prisma.teacher.findUnique({ where: { id: userId } })) {
    return getSubjectsForAdminOrTeacher();
  }

  if (await prisma.student.findUnique({ where: { id: userId } })) {
    return getSubjectsForStudent(userId);
  }

  if (await prisma.parent.findUnique({ where: { id: userId } })) {
    return getSubjectsForParent(userId);
  }

  throw new Error("کاربر نقش مشخصی ندارد");
}



async function getSubjectsForAdminOrTeacher(): Promise<SubjectDataProps[]> {
  const subjects = await prisma.subject.findMany({
    include: { lessons: true, teachers: true },
  });

  return subjects.map(formatSubject);
}

async function getSubjectsForStudent(userId: string): Promise<SubjectDataProps[]> {
  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      class: {
        include: {
          lessons: {
            include: {
              subject: {
                include: { lessons: true, teachers: true },
              },
            },
          },
        },
      },
    },
  });

  if (!student) throw new Error("دانش‌آموز یافت نشد");

  const subjects = student.class.lessons.map((lesson) => lesson.subject);
  return subjects.map(formatSubject);
}

async function getSubjectsForParent(userId: string): Promise<SubjectDataProps[]> {
  const parent = await prisma.parent.findUnique({
    where: { id: userId },
    include: {
      students: {
        include: {
          class: {
            include: {
              lessons: {
                include: {
                  subject: {
                    include: { lessons: true, teachers: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!parent) throw new Error("والد یافت نشد");

  const subjects = parent.students.flatMap((student) =>
    student.class.lessons.map((lesson) => lesson.subject)
  );

  const uniqueSubjects = Array.from(
    new Map(subjects.map((s) => [s.id, s])).values()
  );

  return uniqueSubjects.map(formatSubject);
}

function formatSubject(subject: SubjectWithRelations): SubjectDataProps {
  return {
    name: subject.name,
    teacherCount: subject.teachers?.length || 0,
    lessonCount: subject.lessons?.length || 0,
  };
}
