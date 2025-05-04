"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type FormState = {
  message: string;
};

export async function AddGrade(formData: FormData): Promise<FormState> {
  const grade = formData.get("grade") as string;
  const NumberGrade = Number(grade);

  if (!NumberGrade || NumberGrade <= 0) {
    throw new Error("مقدار grade باید یک عدد مثبت و بزرگتر از صفر باشد.");
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
    throw new Error("خطایی در ایجاد سال تحصیلی جدید رخ داده است.");
  }
}

export async function deleteGrade(formData: FormData): Promise<FormState> {
  const gradeIdString = formData.get("gradeId");
  if (!gradeIdString) {
    throw new Error("مشکلی در حذف به وجود آمد");
  }
  const gradeId = Number(gradeIdString);
  try {
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
  } catch {
    throw new Error("خطایی در حذف سال تحصیلی رخ داده است.");
  }
}

export async function EditGrade(formData: FormData): Promise<FormState> {
  const gradeId = formData.get("gradeId");
  const grade = formData.get("grade") as string;
  const NumberGrade = Number(grade);

  if (!NumberGrade || NumberGrade <= 0) {
    throw new Error("مقدار grade باید یک عدد مثبت و بزرگتر از صفر باشد.");
  }
  if (!gradeId || isNaN(Number(gradeId))) {
    throw new Error("مشکلی در بروزرسانی به وجود آمد");
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
    throw new Error("خطایی در بروزرسانی سال تحصیلی جدید رخ داده است.");
  }
}
