"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
      message: "مقدار grade باید یک عدد مثبت و بزرگتر از صفر باشد." };
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
