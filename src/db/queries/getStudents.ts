import { prisma } from "@/lib/db";

export interface StudentWithRelations {
  id: string;
  name: string;
  surname: string;
  email?: string | null;
  img?: string | null;
  phone?: string | null;
  address: string;
  sex: string;
  parent: {
    id: string;
    name: string;
    surname: string;
  };
  class: {
    id: number;
    name: string;
    grade: {
      level: number;
    };
  };
  results: {
    score: number;
    assignment?: { DueDate: string } | null;
    exam?: { startTime: string } | null;
  }[];
}

export async function getStudentData(userId: string) {
  const now = new Date();

  const admin = await prisma.admin.findUnique({ where: { id: userId } });
  if (admin) {
    const students = await prisma.student.findMany({
      include: {
        class: { include: { grade: true } },
        parent: true,
        results: { include: { assignment: true, exam: true } },
      },
    });

    return students.map((s) => mapStudent(s as StudentWithRelations, now));
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: userId },
    include: {
      lessons: {
        include: {
          class: {
            include: {
              grade: true,
              student: {
                include: {
                  class: { include: { grade: true } },
                  parent: true,
                  results: { include: { assignment: true, exam: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (teacher) {
    const students = teacher.lessons.flatMap((l) => l.class.student);
    return students.map((s) => mapStudent(s as StudentWithRelations, now));
  }

  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      class: {
        include: {
          student: {
            include: {
              class: { include: { grade: true } },
              parent: true,
              results: { include: { assignment: true, exam: true } },
            },
          },
        },
      },
    },
  });

  if (student) {
    return student.class.student.map((s) =>
      mapStudent(s as StudentWithRelations, now)
    );
  }

  const parent = await prisma.parent.findUnique({
    where: { id: userId },
    include: {
      students: {
        include: {
          class: {
            include: {
              student: {
                include: {
                  class: { include: { grade: true } },
                  parent: true,
                  results: { include: { assignment: true, exam: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (parent) {
    const students = parent.students.flatMap((s) => s.class.student);
    return students.map((s) => mapStudent(s as StudentWithRelations, now));
  }

  return [];
}

export function mapStudent(s: StudentWithRelations, now: Date) {
  const upcomingAssignments = s.results.filter(
    (r) => r.assignment && new Date(r.assignment.DueDate) > now
  ).length;

  const upcomingExams = s.results.filter(
    (r) => r.exam && new Date(r.exam.startTime) > now
  ).length;

  const averageScore =
    s.results.reduce((acc, r) => acc + r.score, 0) / (s.results.length || 1);

  return {
    id: s.id,
    label: {
      name: `${s.name} ${s.surname}`,
      email: s.email || undefined,
      img: s.img || undefined,
    },
    phone: s.phone || undefined,
    address: s.address,
    sex: s.sex,
    parent: {
      id: s.parent.id,
      name: `${s.parent.name} ${s.parent.surname}`,
    },
    class: {
      id: s.class.id,
      name: s.class.name,
    },
    grade: s.class.grade.level,
    upcomingAssignments,
    upcomingExams,
    averageScore,
  };
}

export interface StudentDataProps {
  id: string;
  label: {
    name: string;
    email?: string;
    img?: string;
  };
  phone?: string;
  address: string;
  sex: "MALE" | "FEMALE";
  parent: {
    id: string;
    name: string;
  };
  class: {
    id: number;
    name: string;
  };
  grade: number;
  upcomingAssignments: number;
  upcomingExams: number;
  averageScore: number;
  subject?: string;
}
