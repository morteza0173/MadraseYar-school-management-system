"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";



export type FormState = {
  message: string;
};

export async function AddClass(formData: FormData): Promise<FormState> {
  const className = formData.get("className") as string;
  const capacity = Number(formData.get("capacity"));
  const supervisor = formData.get("supervisor") as string;
  const grade = Number(formData.get("grade"));

  try {
    await prisma.class.create({
      data: {
        name: className,
        capacity: capacity,
        supervisorId: supervisor,
        gradeId: grade,
      },
    });

    revalidatePath("/list/class");
    return { message: "کلاس جدید با موفقیت ساخته شد" };
  } catch (error) {
    console.error("Error creating class:", error);
    throw new Error("مشکلی در ثبت کلاس جدید به وجود آمد");
  }
}

export async function EditClass(formData: FormData): Promise<FormState> {
  const classId = formData.get("classId") as string;
  const className = formData.get("className") as string;
  const capacity = Number(formData.get("capacity"));
  const supervisor = formData.get("supervisor") as string;
  const grade = Number(formData.get("grade"));

  console.log("classId", classId);

  try {
    await prisma.class.update({
      where: { name: classId },
      data: {
        name: className,
        capacity: capacity,
        supervisorId: supervisor,
        gradeId: grade,
      },
    });

    revalidatePath("/list/class");
    return { message: "کلاس با موفقیت ویرایش شد" };
  } catch {
    throw new Error("مشکلی در ویرایش کلاس به وجود آمد");
  }
}

export async function DeleteClass(formData: FormData): Promise<FormState> {
  const className = formData.get("classId") as string;

  try {
    // یافتن کلاس موردنظر
    const existingClass = await prisma.class.findUnique({
      where: { name: className },
      include: { student: true }, // دریافت دانش‌آموزان کلاس
    });

    if (!existingClass) {
      throw new Error("کلاس موردنظر یافت نشد.");
    }

    const classId = existingClass.id;

    await prisma.$transaction(async (prisma) => {
      // حذف دانش‌آموزان کلاس
      await prisma.student.deleteMany({
        where: { classId: classId },
      });

      // حذف والدینی که دیگر دانش‌آموزی ندارند
      await prisma.parent.deleteMany({
        where: {
          students: {
            none: {}, // والدینی که هیچ دانش‌آموزی ندارند
          },
        },
      });

      // حذف خود کلاس
      await prisma.class.delete({
        where: { id: classId },
      });
    });

    revalidatePath("/list/class");
    return { message: "کلاس و دانش‌آموزان آن با موفقیت حذف شدند." };
  } catch {
    throw new Error("مشکلی در حذف کلاس به وجود آمد.");
  }
}
