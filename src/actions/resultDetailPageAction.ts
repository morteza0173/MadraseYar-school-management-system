"use server";

import { prisma } from "@/lib/db";


export const updateOrCreateScore = async (formData: FormData) => {
  const scoreValue = Number(formData.get("scoreValue"));
  const studentId = formData.get("studentId") as string;
  const relatedType = formData.get("relatedType") as string;
  const relatedId = Number(formData.get("relatedId"));

  try {
    if (relatedType === "امتحان") {
      // بررسی وجود نمره برای امتحان
      const existingResult = await prisma.result.findFirst({
        where: {
          studentId,
          examId: relatedId,
        },
      });

      if (existingResult) {
        // اگر نمره وجود دارد، آن را به‌روزرسانی کن
        await prisma.result.update({
          where: { id: existingResult.id },
          data: { score: scoreValue },
        });
        return { message: "نمره امتحان با موفقیت به‌روزرسانی شد" };
      } else {
        // اگر نمره وجود ندارد، یک رکورد جدید ایجاد کن
        await prisma.result.create({
          data: {
            score: scoreValue,
            studentId,
            examId: relatedId,
          },
        });
        return { message: "نمره امتحان با موفقیت ثبت شد" };
      }
    } else if (relatedType === "تکلیف") {
      // بررسی وجود نمره برای تکلیف
      const existingResult = await prisma.result.findFirst({
        where: {
          studentId,
          assignmentId: relatedId,
        },
      });

      if (existingResult) {
        // اگر نمره وجود دارد، آن را به‌روزرسانی کن
        await prisma.result.update({
          where: { id: existingResult.id },
          data: { score: scoreValue },
        });
        return { message: "نمره تکلیف با موفقیت به‌روزرسانی شد" };
      } else {
        // اگر نمره وجود ندارد، یک رکورد جدید ایجاد کن
        await prisma.result.create({
          data: {
            score: scoreValue,
            studentId,
            assignmentId: relatedId,
          },
        });
        return { message: "نمره تکلیف با موفقیت ثبت شد" };
      }
    } else {
      throw new Error("نوع داده نامعتبر است");
    }
  } catch {
    throw new Error("خطا در به‌روزرسانی یا ثبت نمره");
  }
};

export const deleteStudentScore = async (formData: FormData) => {
  const studentId = formData.get("studentId") as string;
  const relatedType = formData.get("relatedType") as string;
  const relatedId = Number(formData.get("relatedId"));

  try {
    if (relatedType === "امتحان") {
      // حذف نمره برای امتحان
      await prisma.result.deleteMany({
        where: {
          studentId,
          examId: relatedId,
        },
      });
      return { message: "نمره امتحان با موفقیت حذف شد" };
    } else if (relatedType === "تکلیف") {
      // حذف نمره برای تکلیف
      await prisma.result.deleteMany({
        where: {
          studentId,
          assignmentId: relatedId,
        },
      });
      return { message: "نمره تکلیف با موفقیت حذف شد" };
    } else {
      throw new Error("نوع داده نامعتبر است");
    }
  } catch {
    throw new Error("خطا در حذف نمره");
  }
};
