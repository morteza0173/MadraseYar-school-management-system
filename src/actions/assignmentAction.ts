"use server";

import { prisma } from "@/lib/db";
import { getUserInfoProps } from "./dashboardAction";

export async function getAssignments(user: getUserInfoProps) {
  if (!user) {
    throw new Error("کاربر یافت نشد!");
  }

  let assignmentFilter = {};

  if (user.role === "admin") {
    // ادمین همه تکالیف را می‌بیند
    assignmentFilter = {};
  } else if (user.role === "teacher") {
    // معلم فقط تکالیف مرتبط با کلاس‌های خودش را می‌بیند
    const teacher = await prisma.teacher.findUnique({
      where: { id: user.id },
      include: {
        lessons: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!teacher) return [];

    const lessonIds = teacher.lessons.map((lesson) => lesson.id);

    assignmentFilter = {
      lessonId: { in: lessonIds }, // تکالیف مرتبط با درس‌های معلم
    };
  } else if (user.role === "student") {
    // دانش‌آموز فقط تکالیف مرتبط با کلاس خودش را می‌بیند
    const student = await prisma.student.findUnique({
      where: { id: user.id },
      select: { classId: true },
    });

    if (!student) return [];

    assignmentFilter = {
      lesson: { classId: student.classId }, // تکالیف مرتبط با کلاس دانش‌آموز
    };
  } else if (user.role === "parent") {
    // والدین فقط تکالیف مرتبط با کلاس دانش‌آموزان خود را می‌بینند
    const parent = await prisma.parent.findUnique({
      where: { id: user.id },
      select: {
        students: {
          select: { classId: true },
        },
      },
    });

    if (!parent) return [];

    const classIds = parent.students.map((student) => student.classId);

    assignmentFilter = {
      lesson: { classId: { in: classIds } }, // تکالیف مرتبط با کلاس دانش‌آموزان
    };
  }

  const assignments = await prisma.assignment.findMany({
    where: assignmentFilter,
    orderBy: { DueDate: "asc" }, // مرتب‌سازی بر اساس تاریخ تحویل
    select: {
      id: true,
      title: true,
      DueDate: true,
      StartDate: true,
      lesson: {
        select: {
          id: true,
          name: true,
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return assignments.map((assignment) => ({
    id: assignment.id,
    title: assignment.title,
    startDate: assignment.StartDate,
    dueDate: assignment.DueDate,
    lessonId: assignment.lesson?.id || undefined,
    lessonName: assignment.lesson?.name || "نامشخص",
    classId: assignment.lesson?.class?.id || undefined,
    className: assignment.lesson?.class?.name || "نامشخص",
  }));
}

export async function AddAssignmentData(formData: FormData) {
  const title = formData.get("title") as string;
  const dueDate = formData.get("dueDate") as string;
  const lessonId = parseInt(formData.get("lessonId") as string, 10); // شناسه درس

  try {
    // بررسی الزامی بودن فیلدها
    if (!title || !dueDate || !lessonId) {
      throw new Error("عنوان، تاریخ تحویل و شناسه درس الزامی هستند!");
    }

    // ایجاد تکلیف جدید
    await prisma.assignment.create({
      data: {
        title,
        StartDate: new Date(), // تاریخ شروع به صورت پیش‌فرض زمان فعلی
        DueDate: new Date(dueDate), // تاریخ تحویل
        lessonId, // شناسه درس
      },
    });

    return {
      message: "تکلیف با موفقیت اضافه شد",
    };
  } catch {
    return { message: "خطا در اضافه کردن تکلیف" };
  }
}

export async function EditAssignmentData(formData: FormData) {
  const id = parseInt(formData.get("id") as string, 10); // شناسه تکلیف
  const title = formData.get("title") as string;
  const dueDate = formData.get("dueDate") as string;
  const lessonId = parseInt(formData.get("lessonId") as string, 10); // شناسه درس

  try {
    // بررسی الزامی بودن فیلدها
    if (!id || !title || !dueDate || !lessonId) {
      throw new Error("شناسه، عنوان، تاریخ تحویل و شناسه درس الزامی هستند!");
    }

    // ویرایش تکلیف
    await prisma.assignment.update({
      where: { id },
      data: {
        title,
        DueDate: new Date(dueDate), // تاریخ تحویل
        lessonId, // شناسه درس
      },
    });

    return {
      message: "تکلیف با موفقیت ویرایش شد",
    };
  } catch {
    return { message: "خطا در ویرایش تکلیف" };
  }
}

export async function DeleteAssignmentData(formData: FormData) {
  const id = parseInt(formData.get("id") as string, 10); // شناسه تکلیف

  try {
    if (!id) {
      throw new Error("شناسه تکلیف الزامی است!");
    }

    // حذف تکلیف
    await prisma.assignment.delete({
      where: { id },
    });

    return {
      message: "تکلیف با موفقیت حذف شد",
    };
  } catch {
    return { message: "خطا در حذف تکلیف" };
  }
}

export async function DeleteMultipleAssignmentsData(ids: number[]) {
  try {
    if (!ids || ids.length === 0) {
      throw new Error("هیچ شناسه‌ای برای حذف ارسال نشده است!");
    }

    // حذف تکالیف
    await prisma.assignment.deleteMany({
      where: {
        id: {
          in: ids, // حذف تکالیفی که شناسه آن‌ها در آرایه `ids` است
        },
      },
    });

    return {
      message: "تکلیف با موفقیت حذف شد",
    };
  } catch {
    return { message: "خطا در حذف تکلیف" };
  }
}
