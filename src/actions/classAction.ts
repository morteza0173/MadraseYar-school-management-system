"use server";

import { prisma } from "@/lib/db";
import { getUserInfoProps } from "./dashboardAction";
import { revalidatePath } from "next/cache";

export async function getClassDetails(user: getUserInfoProps) {
  if (!user) {
    throw new Error("کاربر یافت نشد!");
  }

  let classFilter = {};

  if (user.role === "ADMIN") {
  } else if (user.role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({
      where: { id: user.id },
      select: { classes: { select: { id: true } } },
    });

    if (!teacher) return [];

    classFilter = {
      id: { in: teacher.classes.map((cls) => cls.id) },
    };
  } else if (user.role === "PARENT") {
    const parent = await prisma.parent.findUnique({
      where: { id: user.id },
      select: {
        students: {
          select: { classId: true },
        },
      },
    });

    if (!parent) return [];

    classFilter = {
      id: { in: parent.students.map((student) => student.classId) },
    };
  } else if (user.role === "STUDENT") {
    const student = await prisma.student.findUnique({
      where: { id: user.id },
      select: { classId: true },
    });

    if (!student) return [];

    classFilter = { id: student.classId };
  }

  const classDetails = await prisma.class.findMany({
    where: classFilter,
    select: {
      name: true, // نام کلاس
      grade: {
        select: {
          level: true, // سال تحصیلی
        },
      },
      capacity: true, // ظرفیت کلاس
      student: {
        select: {
          id: true,
        },
      },
      supervisor: {
        select: {
          name: true, // نام مشاور کلاس
          surname: true, // نام خانوادگی مشاور
        },
      },
    },
  });

  return classDetails.map((cls) => ({
    name: cls.name,
    grade: cls.grade.level,
    capacity: cls.capacity,
    studentCount: cls.student.length, // تعداد دانش‌آموزان
    supervisor: `${cls.supervisor.name} ${cls.supervisor.surname}`, // نام کامل مشاور
  }));
}

export type FormState = {
  message: string;
};

export async function AddClass(
  _PrevState: FormState,
  formData: FormData
): Promise<FormState> {
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
    return { message: "مشکلی در ثبت کلاس جدید به وجود آمد" };
  }
}

export async function EditClass(
  _PrevState: FormState,
  formData: FormData
): Promise<FormState> {
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
  } catch (error) {
    console.error("Error updating class:", error);
    return { message: "مشکلی در ویرایش کلاس به وجود آمد" };
  }
}

export async function DeleteClass(
  _PrevState: FormState,
  formData: FormData
): Promise<FormState> {
  const className = formData.get("classId") as string;

  try {
    // یافتن کلاس موردنظر
    const existingClass = await prisma.class.findUnique({
      where: { name: className },
      include: { student: true }, // دریافت دانش‌آموزان کلاس
    });

    if (!existingClass) {
      return { message: "کلاس موردنظر یافت نشد." };
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
  } catch (error) {
    console.error("Error deleting class and dependencies:", error);
    return { message: "مشکلی در حذف کلاس به وجود آمد." };
  }
}
