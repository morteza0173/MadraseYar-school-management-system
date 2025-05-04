// SOLID و Clean Code پیاده‌سازی بر اساس اصول

import { prisma } from "@/lib/db";
import { RankedStudent, RelatedResult, Role } from "@/lib/type";



interface Student {
  id: string;
  name: string;
  surname: string;
}

interface Result {
  student: Student;
  score: number | null;
}



interface GetExamOrAssignmentDetailsParams {
  id: number;
  decodedRelatedResult: RelatedResult;
  role: Role;
}



export const getExamOrAssignmentDetails = async ({
  id,
  decodedRelatedResult,
  role,
}: GetExamOrAssignmentDetailsParams): Promise<RankedStudent[] | undefined> => {
  if (role === "admin" || role === "teacher") {
    const entityDetails = await fetchEntityDetails(decodedRelatedResult, id);
    if (!entityDetails) return;

    const students: RankedStudent[] = entityDetails.lesson.class.student.map(
      (student) => {
        const result = entityDetails.results.find(
          (res) => res.student.id === student.id
        );
        return {
          id: student.id,
          fullName: `${student.name} ${student.surname}`,
          score: result?.score ?? null,
          rank: null,
        };
      }
    );

    return getRankedStudents(students);
  }

  if (role === "student" || role === "parent") {
    const results = await fetchStudentResults(decodedRelatedResult, id);
    return results.map((result, index) => ({
      id: result.student.id,
      fullName: `${result.student.name} ${result.student.surname}`,
      score: result.score,
      rank: index + 1,
    }));
  }

  return;
};


const getRankedStudents = (students: RankedStudent[]): RankedStudent[] => {
  const scoredStudents = students
    .filter((student) => student.score !== null)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .map((student, index) => ({ ...student, rank: index + 1 }));

  return students
    .map((student) => {
      const ranked = scoredStudents.find((s) => s.id === student.id);
      return ranked || student;
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0));
};

const fetchEntityDetails = async (
  type: RelatedResult,
  id: number
): Promise<{
  lesson: {
    class: {
      student: Student[];
    };
  };
  results: Result[];
} | null> => {
  if (type === "امتحان") {
    return await prisma.exam.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            class: {
              include: {
                student: {
                  select: {
                    id: true,
                    name: true,
                    surname: true,
                  },
                },
              },
            },
          },
        },
        results: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                surname: true,
              },
            },
          },
          orderBy: { score: "desc" },
        },
      },
    });
  } else {
    return await prisma.assignment.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            class: {
              include: {
                student: {
                  select: {
                    id: true,
                    name: true,
                    surname: true,
                  },
                },
              },
            },
          },
        },
        results: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                surname: true,
              },
            },
          },
          orderBy: { score: "desc" },
        },
      },
    });
  }
};

const fetchStudentResults = async (
  type: RelatedResult,
  id: number
): Promise<Result[]> => {
  if (type === "امتحان") {
    return await prisma.result.findMany({
      where: {
        examId: id,
        NOT: { score: undefined },
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },
      orderBy: { score: "desc" },
    });
  } else {
    return await prisma.result.findMany({
      where: {
        assignmentId: id,
        NOT: { score: undefined },
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },
      orderBy: { score: "desc" },
    });
  }
};
