"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function AddLesson(data: Prisma.LessonCreateInput) {
  try {
    await prisma.lesson.create({ data });
    return {
      message: "درس جدید با موفقیت ایجاد شد و به برنامه هفتگی افزوده شد",
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function EditLesson({
  data,
  id,
}: {
  data: Prisma.LessonUpdateInput;
  id: number;
}) {
  try {
    await prisma.lesson.update({
      where: { id },
      data,
    });
    return {
      message: "درس با موفقیت ویرایش شد",
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function DeleteLesson(formData: FormData) {
  const id = formData.get("id");
  const idNumber = Number(id);
  try {
    await prisma.lesson.delete({
      where: { id: idNumber },
    });
    return {
      message: "درس با موفقیت حذف شد",
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function DeleteLessons(ids: number[]) {
  try {
    await prisma.lesson.deleteMany({
      where: { id: { in: ids } },
    });
    return {
      message: "درس‌ها با موفقیت حذف شدند",
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}
