"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

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

export type FormState = {
  message: string;
};

export async function AddGrade(
  _PrevState: FormState,
  formData: FormData
): Promise<FormState> {
  const grade = formData.get("grade") as string;
  const NumberGrade = Number(grade);

  if (!NumberGrade || NumberGrade <= 0) {
    return {
      message: "مقدار grade باید یک عدد مثبت و بزرگتر از صفر باشد.",
    };
  }

  try {
    await prisma.grade.create({
      data: {
        level: NumberGrade,
      },
    });

    revalidatePath("/list/grade");
    return { message: "سال تحصیلی با موفقیت افزوده شد" };
  } catch {
    return { message: "خطایی در ایجاد سال تحصیلی جدید رخ داده است." };
  }
}

export async function deleteGrade(
  _PrevState: FormState,
  formData: FormData
): Promise<FormState> {
  const gradeIdString = formData.get("gradeId");
  if (!gradeIdString) {
    return { message: "مشکلی در حذف به وجود آمد" };
  }
  const gradeId = Number(gradeIdString);

  await prisma.$transaction(async (tx) => {
    const relatedClasses = await tx.class.findMany({
      where: { gradeId },
      include: { student: { include: { parent: true } } },
    });

    for (const classItem of relatedClasses) {
      for (const student of classItem.student) {
        const siblings = await tx.student.findMany({
          where: { parentId: student.parentId },
        });

        await tx.student.delete({ where: { id: student.id } });

        if (siblings.length === 1) {
          await tx.parent.delete({ where: { id: student.parentId } });
        }
      }
    }

    await tx.class.deleteMany({ where: { gradeId } });

    await tx.grade.delete({ where: { id: gradeId } });
  });

  revalidatePath("/list/grade");

  return { message: "با موفقیت حذف شد" };
}

export async function EditGrade(
  _PrevState: FormState,
  formData: FormData
): Promise<FormState> {
  const gradeId = formData.get("gradeId");
  const grade = formData.get("grade") as string;
  const NumberGrade = Number(grade);

  if (!NumberGrade || NumberGrade <= 0) {
    return {
      message: "مقدار grade باید یک عدد مثبت و بزرگتر از صفر باشد.",
    };
  }
    if (!gradeId || isNaN(Number(gradeId))) {
      return {
        message: "مشکلی در بروزرسانی به وجود آمد",
      };
    }

  try {
    await prisma.grade.update({
      where: {
        id: Number(gradeId),
      },
      data: {
        level: NumberGrade,
      },
    });

    revalidatePath("/list/grade");
    return { message: "سال تحصیلی با موفقیت بروزرسانی شد" };
  } catch {
    return { message: "خطایی در بروزرسانی سال تحصیلی جدید رخ داده است." };
  }
}
