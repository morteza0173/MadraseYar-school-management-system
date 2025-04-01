"use server";

import { prisma } from "@/lib/db";
import { getUserInfoProps } from "./dashboardAction";

export async function getExams(user: getUserInfoProps) {
  if (!user) {
    throw new Error("کاربر یافت نشد!");
  }

  let examFilter = {};

  if (user.role === "admin") {
    // ادمین همه امتحانات را می‌بیند
    examFilter = {};
  } else if (user.role === "teacher") {
    // معلم فقط امتحانات عمومی و مرتبط با کلاس‌های خودش را می‌بیند
    const teacher = await prisma.teacher.findUnique({
      where: { id: user.id },
      include: {
        lessons: {
          select: {
            classId: true,
          },
        },
      },
    });

    if (!teacher) return [];

    const classIds = teacher.lessons.map((lesson) => lesson.classId);

    examFilter = {
      OR: [
        { lesson: { classId: undefined } }, // امتحانات عمومی
        { lesson: { classId: { in: classIds } } }, // امتحانات مرتبط با کلاس‌های معلم
      ],
    };
  } else if (user.role === "student") {
    // دانش‌آموز فقط امتحانات عمومی و مرتبط با کلاس خودش را می‌بیند
    const student = await prisma.student.findUnique({
      where: { id: user.id },
      select: { classId: true },
    });

    if (!student) return [];

    examFilter = {
      OR: [
        { lesson: { classId: undefined } }, // امتحانات عمومی
        { lesson: { classId: student.classId } }, // امتحانات مرتبط با کلاس دانش‌آموز
      ],
    };
  } else if (user.role === "parent") {
    // والدین فقط امتحانات عمومی و مرتبط با کلاس دانش‌آموزان خود را می‌بینند
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

    examFilter = {
      OR: [
        { lesson: { classId: undefined } }, // امتحانات عمومی
        { lesson: { classId: { in: classIds } } }, // امتحانات مرتبط با کلاس دانش‌آموزان
      ],
    };
  }

  const exams = await prisma.exam.findMany({
    where: examFilter,
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      title: true,
      startTime: true,
      endTime: true,
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

  return exams.map((exam) => ({
    id: exam.id,
    title: exam.title,
    startTime: exam.startTime,
    endTime: exam.endTime,
    lessonId: exam.lesson?.id || undefined,
    lessonName: exam.lesson?.name || "نامشخص",
    classId: exam.lesson?.class?.id || undefined,
    className: exam.lesson?.class?.name || "نامشخص",
  }));
}

export async function AddExamData(formData: FormData) {
  const title = formData.get("title") as string;
  const startTime = formData.get("startTime") as string;
  const lessonId = parseInt(formData.get("lessonId") as string, 10); // شناسه درس

  try {
    // بررسی الزامی بودن فیلدها
    if (!title || !startTime || !lessonId) {
      throw new Error("عنوان، زمان شروع و شناسه درس الزامی هستند!");
    }

    // ایجاد امتحان جدید
    await prisma.exam.create({
      data: {
        title,
        startTime: new Date(startTime), // ذخیره زمان شروع
        endTime: new Date(startTime), // مقدار endTime برابر با startTime
        lessonId, // شناسه درس
      },
    });

    return {
      message: "امتحان با موفقیت اضافه شد",
    };
  } catch {
    return { message: "خطا در اضافه کردن امتحان" };
  }
}

export async function EditExamData(formData: FormData) {
  const id = parseInt(formData.get("id") as string, 10); // شناسه امتحان
  const title = formData.get("title") as string;
  const startTime = formData.get("startTime") as string;
  const lessonId = parseInt(formData.get("lessonId") as string, 10); // شناسه درس

  try {
    // بررسی الزامی بودن فیلدها
    if (!id || !title || !startTime || !lessonId) {
      throw new Error("شناسه، عنوان، زمان شروع و شناسه درس الزامی هستند!");
    }

    // به‌روزرسانی امتحان
    await prisma.exam.update({
      where: { id },
      data: {
        title,
        startTime: new Date(startTime), // به‌روزرسانی زمان شروع
        endTime: new Date(startTime), // مقدار endTime برابر با startTime
        lessonId, // شناسه درس
      },
    });

    return {
      message: "امتحان با موفقیت ویرایش شد",
    };
  } catch {
    return { message: "خطا در ویرایش امتحان" };
  }
}

export async function DeleteExamData(formData: FormData) {
  const id = parseInt(formData.get("id") as string, 10); // شناسه امتحان

  try {
    if (!id) {
      throw new Error("شناسه امتحان الزامی است!");
    }

    // حذف امتحان
    await prisma.exam.delete({
      where: { id },
    });

    return {
      message: "امتحان با موفقیت حذف شد",
    };
  } catch {
    return { message: "خطا در حذف امتحان" };
  }
}

export async function DeleteMultipleExamsData(ids: number[]) {
  try {
    if (!ids || ids.length === 0) {
      throw new Error("هیچ شناسه‌ای برای حذف ارسال نشده است!");
    }

    // حذف امتحانات
    await prisma.exam.deleteMany({
      where: {
        id: {
          in: ids, // حذف امتحاناتی که شناسه آن‌ها در آرایه `ids` است
        },
      },
    });

    return {
      message: "امتحانات با موفقیت حذف شدند",
    };
  } catch {
    return { message: "خطا در حذف امتحانات" };
  }
}
