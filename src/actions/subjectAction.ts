"use server";

import { prisma } from "@/lib/db";

export async function createSubjectAction(formData: FormData) {
  // دریافت مقدار subjectName از فرم
  const subjectName = formData.get("subjectName");

  // اعتبارسنجی مقدار دریافتی
  if (typeof subjectName !== "string" || subjectName.trim() === "") {
    throw new Error("نام حوزه تدریس نمیتواند خالی باشد");
  }

  try {
    // ایجاد سابجکت جدید در دیتابیس
    await prisma.subject.create({
      data: {
        name: subjectName.trim(),
      },
    });
    return { message: "حوزه تدریس با موفقیت ایجاد شد" };
  } catch {
    throw new Error("خطا در ایجاد حوزه تدریس");
  }
}

export async function deleteSubjectAction(formData: FormData) {
  // دریافت مقدار subjectName از فرم
  const subjectName = formData.get("subjectName");

  // اعتبارسنجی مقدار دریافتی
  if (typeof subjectName !== "string" || subjectName.trim() === "") {
    throw new Error("نام حوزه تدریس نمیتواند خالی باشد");
  }

  try {
    // حذف سابجکت با استفاده از نام (یونیک)
    await prisma.subject.delete({
      where: {
        name: subjectName.trim(),
      },
    });

    return { message: "حوزه تدریس با موفقیت حذف شد" };
  } catch {
    throw new Error("خطا در حذف حوزه تدریس");
  }
}

export async function updateSubjectAction(formData: FormData) {
  // دریافت مقدار نام قدیمی و نام جدید از فرم
  const oldSubjectName = formData.get("oldSubjectName");
  const newSubjectName = formData.get("newSubjectName");

  // اعتبارسنجی ورودی‌ها
  if (typeof oldSubjectName !== "string" || oldSubjectName.trim() === "") {
    throw new Error("نام قدیمی حوزه تحصیلی الزامی است.");
  }
  if (typeof newSubjectName !== "string" || newSubjectName.trim() === "") {
    throw new Error("نام جدید حوزه تحصیلی الزامی است.");
  }

  try {
    // به‌روزرسانی سابجکت با استفاده از نام قدیمی به عنوان شناسه
    await prisma.subject.update({
      where: { name: oldSubjectName.trim() },
      data: { name: newSubjectName.trim() },
    });
    return { message: "حوزه تدریس با موفقیت ویرایش شد" };
  } catch {
    throw new Error("ویرایش حوزه تدریس با خطا رو به رو شد");
  }
}
