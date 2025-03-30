"use server";

import { prisma } from "@/lib/db";
import { getUserInfoProps } from "./dashboardAction";

export async function getEvents(user: getUserInfoProps) {
  if (!user) {
    throw new Error("کاربر یافت نشد!");
  }

  let eventFilter = {};

  if (user.role === "ADMIN") {
    // ادمین همه رویدادها را می‌بیند
    eventFilter = {};
  } else if (user.role === "TEACHER") {
    // معلم فقط رویدادهای عمومی و مرتبط با کلاس‌های خودش را می‌بیند
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

    eventFilter = {
      OR: [
        { classId: null }, // رویدادهای عمومی
        { classId: { in: classIds } }, // رویدادهای مرتبط با کلاس‌های معلم
      ],
    };
  } else if (user.role === "STUDENT") {
    // دانش‌آموز فقط رویدادهای عمومی و مرتبط با کلاس خودش را می‌بیند
    const student = await prisma.student.findUnique({
      where: { id: user.id },
      select: { classId: true },
    });

    if (!student) return [];

    eventFilter = {
      OR: [
        { classId: null }, // رویدادهای عمومی
        { classId: student.classId }, // رویدادهای مرتبط با کلاس دانش‌آموز
      ],
    };
  } else if (user.role === "PARENT") {
    // والدین فقط رویدادهای عمومی و مرتبط با کلاس دانش‌آموزان خود را می‌بینند
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

    eventFilter = {
      OR: [
        { classId: null }, // رویدادهای عمومی
        { classId: { in: classIds } }, // رویدادهای مرتبط با کلاس دانش‌آموزان
      ],
    };
  }

  const events = await prisma.event.findMany({
    where: eventFilter,
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      startTime: true,
      endTime: true,
      class: {
        select: {
          name: true,
        },
      },
    },
  });

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
    className: event.class?.name || "عمومی",
  }));
}

export async function AddEventData(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const className = formData.get("className") as string;
  const startTime = formData.get("startTime") as string;

  try {
    if (!title || !description || !startTime) {
      throw new Error("عنوان، توضیحات و زمان شروع الزامی هستند!");
    }

    const classData = className
      ? await prisma.class.findUnique({
          where: { name: className },
        })
      : null;

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        startTime: new Date(startTime), // ذخیره زمان شروع
        endTime: new Date(startTime), // مقدار endTime برابر با startTime
        classId: classData?.id || null, // اگر کلاس وجود نداشت، عمومی باشد
      },
    });

    return {
      message: "رویداد با موفقیت اضافه شد",
      event: newEvent,
    };
  } catch {
    return { message: "خطا در اضافه کردن رویداد" };
  }
}

export async function EditEventData(formData: FormData) {
  const id = parseInt(formData.get("id") as string, 10); // شناسه رویداد
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const className = formData.get("className") as string;
  const startTime = formData.get("startTime") as string;

  try {
    if (!id || !title || !description || !startTime) {
      throw new Error("شناسه، عنوان، توضیحات و زمان شروع الزامی هستند!");
    }

    const classData = className
      ? await prisma.class.findUnique({
          where: { name: className },
        })
      : null;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        startTime: new Date(startTime), // به‌روزرسانی زمان شروع
        endTime: new Date(startTime), // مقدار endTime برابر با startTime
        classId: classData?.id || null, // اگر کلاس وجود نداشت، عمومی باشد
      },
    });

    return {
      message: "رویداد با موفقیت ویرایش شد",
      event: updatedEvent,
    };
  } catch {
    return { message: "خطا در ویرایش رویداد" };
  }
}

export async function DeleteEventData(formData: FormData) {
  const id = parseInt(formData.get("id") as string, 10); // شناسه رویداد

  try {
    if (!id) {
      throw new Error("شناسه رویداد الزامی است!");
    }

    await prisma.event.delete({
      where: { id },
    });

    return {
      message: "رویداد با موفقیت حذف شد",
    };
  } catch {
    return { message: "خطا در حذف رویداد" };
  }
}

export async function DeleteMultipleEventsData(ids: number[]) {
  try {
    if (!ids || ids.length === 0) {
      throw new Error("هیچ شناسه‌ای برای حذف ارسال نشده است!");
    }

    await prisma.event.deleteMany({
      where: {
        id: {
          in: ids, // حذف رویدادهایی که شناسه آن‌ها در آرایه `ids` است
        },
      },
    });

    return {
      message: "رویدادها با موفقیت حذف شدند",
    };
  } catch {
    return { message: "خطا در حذف رویدادها" };
  }
}
