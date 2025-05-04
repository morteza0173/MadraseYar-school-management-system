"use server";

import { prisma } from "@/lib/db";



export async function AddAnnouncementData(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const className = formData.get("className") as string;

  try {
    if (!title || !description) {
      throw new Error("عنوان و توضیحات الزامی هستند!");
    }

    const classData = className
      ? await prisma.class.findUnique({
          where: { name: className },
        })
      : null;

    await prisma.announcement.create({
      data: {
        title,
        description,
        date: new Date(Date.now()), // تاریخ فعلی
        classId: classData?.id || null, // اگر کلاس وجود نداشت، عمومی باشد
      },
    });

    return {
      message: "اعلامیه با موفقیت اضافه شد",
    };
  } catch {
    return { message: "خطا در اضافه کردن اعلامیه" };
  }
}

export async function EditAnnouncementData(formData: FormData) {
  const id = parseInt(formData.get("id") as string, 10); // شناسه اعلامیه
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const className = formData.get("className") as string;

  try {
    if (!id || !title || !description) {
      throw new Error("شناسه، عنوان و توضیحات الزامی هستند!");
    }

    const classData = className
      ? await prisma.class.findUnique({
          where: { name: className },
        })
      : null;

    await prisma.announcement.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(Date.now()),
        classId: classData?.id || null,
      },
    });

    return {
      message: "اعلامیه با موفقیت ویرایش شد",
    };
  } catch {
    return { message: "خطا در ویرایش اعلامیه" };
  }
}

export async function DeleteAnnouncementData(formData: FormData) {
  const id = parseInt(formData.get("id") as string, 10); // شناسه اعلامیه

  try {
    if (!id) {
      throw new Error("شناسه اعلامیه الزامی است!");
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return {
      message: "اعلامیه با موفقیت حذف شد",
    };
  } catch {
    return { message: "خطا در حذف اعلامیه" };
  }
}
