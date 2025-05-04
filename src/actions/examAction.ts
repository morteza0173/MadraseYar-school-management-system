"use server";

import { prisma } from "@/lib/db";


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
