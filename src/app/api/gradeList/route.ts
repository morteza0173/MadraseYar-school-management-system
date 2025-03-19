import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
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

  const result = grades.map((grade) => ({
    id: grade.id,
    level: grade.level,
    students: grade.students.length,
    classes: grade.classes.length,
  }));

  return NextResponse.json(result);
}
