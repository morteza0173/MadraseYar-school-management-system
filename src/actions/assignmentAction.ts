"use server";

import { prisma } from "@/lib/db";



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
