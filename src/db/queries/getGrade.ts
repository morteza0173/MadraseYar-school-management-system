import { prisma } from "@/lib/db";

export interface gradeListProps {
  id: number;
  level: number;
  students: number;
  classes: number;
}

export async function GetGradeData() {
  const grades = await prisma.grade.findMany({
    select: {
      id: true,
      level: true,
      students: {
        select: {
          id: true,
        },
      },
      classes: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      level: "asc",
    },
  });

  return grades.map((grade) => ({
    id: grade.id,
    level: grade.level,
    students: grade.students.length,
    classes: grade.classes.length,
  }));
}
