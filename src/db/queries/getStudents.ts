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
    lessons: {
      id: number;
      exams: { id: number; startTime: Date }[];
      assignment: { id: number; DueDate: Date }[];
    }[];
  };
  results: {
    score: number;
    examId?: number | null;
    assignmentId?: number | null;
  }[];
}

export async function getStudentData(userId: string) {
  const now = new Date();

  const admin = await prisma.admin.findUnique({ where: { id: userId } });
  if (admin) {
    const students = await prisma.student.findMany({
      include: {
        class: {
          include: {
            grade: true,
            lessons: { include: { exams: true, assignment: true } },
          },
        },
        parent: true,
        results: true,
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
                  class: {
                    include: {
                      grade: true,
                      lessons: {
                        include: {
                          exams: true,
                          assignment: true,
                        },
                      },
                    },
                  },
                  parent: true,
                  results: true,
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
    const uniqueStudents = Array.from(
      new Map(students.map((s) => [s.id, s])).values()
    );
    return uniqueStudents.map((s) =>
      mapStudent(s as StudentWithRelations, now)
    );
  }

  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      class: {
        include: {
          student: {
            include: {
              class: {
                include: {
                  grade: true,
                  lessons: {
                    include: {
                      exams: true,
                      assignment: true,
                    },
                  },
                },
              },
              parent: true,
              results: true,
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
                  class: {
                    include: {
                      grade: true,
                      lessons: {
                        include: {
                          exams: true,
                          assignment: true,
                        },
                      },
                    },
                  },
                  parent: true,
                  results: true,
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
  const allLessonExams = s.class.lessons.flatMap((lesson) => lesson.exams);
  const allLessonAssignments = s.class.lessons.flatMap(
    (lesson) => lesson.assignment
  );

  const studentExamIds = new Set(
    s.results.filter((r) => r.examId !== null).map((r) => r.examId)
  );
  const studentAssignmentIds = new Set(
    s.results.filter((r) => r.assignmentId !== null).map((r) => r.assignmentId)
  );

  const upcomingExams = allLessonExams.filter(
    (exam) => new Date(exam.startTime) > now && !studentExamIds.has(exam.id)
  ).length;

  const upcomingAssignments = allLessonAssignments.filter(
    (assignment) =>
      new Date(assignment.DueDate) > now &&
      !studentAssignmentIds.has(assignment.id)
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
