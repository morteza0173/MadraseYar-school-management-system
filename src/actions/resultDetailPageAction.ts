"use server";

import { prisma } from "@/lib/db";

interface GetExamOrAssignmentDetailsParams {
  id: number; // ID امتحان یا تکلیف
  decodedRelatedResult: string; // "امتحان" یا "تکلیف"
  role: string; // نقش کاربر (admin, teacher, student, parent)
}

export const getExamOrAssignmentDetails = async ({
  id,
  decodedRelatedResult,
  role,
}: GetExamOrAssignmentDetailsParams) => {
  if (decodedRelatedResult === "امتحان") {
    if (role === "admin" || role === "teacher") {
      // برای مدیر یا معلم: تمام دانش‌آموزان کلاس
      const examDetails = await prisma.exam.findUnique({
        where: { id },
        include: {
          lesson: {
            include: {
              class: {
                include: {
                  student: {
                    select: {
                      id: true,
                      name: true,
                      surname: true,
                    },
                  },
                },
              },
            },
          },
          results: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                },
              },
            },
            orderBy: {
              score: "desc",
            },
          },
        },
      });

      if (!examDetails) {
        return;
      }

      const students = examDetails.lesson.class.student.map((student) => {
        const result = examDetails.results.find(
          (res) => res.student.id === student.id
        );
        return {
          id: student.id,
          fullName: `${student.name} ${student.surname}`,
          score: result?.score || null,
          rank: null, // مقدار پیش‌فرض برای رتبه
        };
      });

      // محاسبه رتبه‌بندی فقط برای دانش‌آموزانی که نمره دارند
      const rankedStudentsWithScores = students
        .filter((student) => student.score !== null) // فقط دانش‌آموزانی که نمره دارند
        .sort((a, b) => (b.score || 0) - (a.score || 0)) // مرتب‌سازی بر اساس نمره (نزولی)
        .map((student, index) => ({
          ...student,
          rank: index + 1, // محاسبه رتبه
        }));

      // ترکیب رتبه‌بندی با لیست اصلی دانش‌آموزان
      const finalRankedStudents = students.map((student) => {
        const rankedStudent = rankedStudentsWithScores.find(
          (ranked) => ranked.id === student.id
        );
        return rankedStudent || student; // اگر دانش‌آموز رتبه داشته باشد، از رتبه‌بندی استفاده می‌شود
      });

      return finalRankedStudents.sort(
        (a, b) => (b.score || 0) - (a.score || 0)
      );
    } else if (role === "student" || role === "parent") {
      // برای دانش‌آموز یا خانواده: فقط دانش‌آموزانی که نمره دارند
      const studentResults = await prisma.result.findMany({
        where: {
          examId: id,
          NOT: { score: undefined }, // فقط دانش‌آموزانی که نمره دارند
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
        orderBy: {
          score: "desc",
        },
      });

      const rankedResults = studentResults
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .map((result, index) => ({
          id: result.student.id,
          fullName: `${result.student.name} ${result.student.surname}`,
          score: result.score,
          rank: index + 1,
        }));

      return rankedResults;
    }
  } else if (decodedRelatedResult === "تکلیف") {
    if (role === "admin" || role === "teacher") {
      // برای مدیر یا معلم: تمام دانش‌آموزان کلاس
      const assignmentDetails = await prisma.assignment.findUnique({
        where: { id },
        include: {
          lesson: {
            include: {
              class: {
                include: {
                  student: {
                    select: {
                      id: true,
                      name: true,
                      surname: true,
                    },
                  },
                },
              },
            },
          },
          results: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                },
              },
            },
            orderBy: {
              score: "desc",
            },
          },
        },
      });

      if (!assignmentDetails) {
        return;
      }

      const students = assignmentDetails.lesson.class.student.map((student) => {
        const result = assignmentDetails.results.find(
          (res) => res.student.id === student.id
        );
        return {
          id: student.id,
          fullName: `${student.name} ${student.surname}`,
          score: result?.score || null,
          rank: null,
        };
      });

      // محاسبه رتبه‌بندی
      const rankedStudentsWithScores = students
        .filter((student) => student.score !== null) // فقط دانش‌آموزانی که نمره دارند
        .sort((a, b) => (b.score || 0) - (a.score || 0)) // مرتب‌سازی بر اساس نمره (نزولی)
        .map((student, index) => ({
          ...student,
          rank: index + 1, // محاسبه رتبه
        }));

      // ترکیب رتبه‌بندی با لیست اصلی دانش‌آموزان
      const finalRankedStudents = students.map((student) => {
        const rankedStudent = rankedStudentsWithScores.find(
          (ranked) => ranked.id === student.id
        );
        return rankedStudent || student; // اگر دانش‌آموز رتبه داشته باشد، از رتبه‌بندی استفاده می‌شود
      });

      return finalRankedStudents.sort(
        (a, b) => (b.score || 0) - (a.score || 0)
      );
    } else if (role === "student" || role === "parent") {
      // برای دانش‌آموز یا خانواده: فقط دانش‌آموزانی که نمره دارند
      const studentResults = await prisma.result.findMany({
        where: {
          assignmentId: id,
          NOT: { score: undefined }, // فقط دانش‌آموزانی که نمره دارند
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
        orderBy: {
          score: "desc",
        },
      });

      const rankedResults = studentResults
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .map((result, index) => ({
          id: result.student.id,
          fullName: `${result.student.name} ${result.student.surname}`,
          score: result.score,
          rank: index + 1,
        }));

      return rankedResults;
    }
  }

  return;
};

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
