"use server";

import { prisma } from "@/lib/db";

export async function getSubjectsData(userId: string) {
  // بررسی نقش ادمین
  const admin = await prisma.admin.findUnique({
    where: { id: userId },
  });

  if (admin) {
    const subjects = await prisma.subject.findMany({
      include: {
        lessons: true,
        teachers: true,
      },
    });

    return subjects.map((subject) => ({
      name: subject.name,
      teacherCount: subject.teachers.length,
      lessonCount: subject.lessons.length,
    }));
  }

  // بررسی نقش معلم (اکنون مثل ادمین همه را می‌بیند)
  const teacher = await prisma.teacher.findUnique({
    where: { id: userId },
  });

  if (teacher) {
    const subjects = await prisma.subject.findMany({
      include: {
        lessons: true,
        teachers: true,
      },
    });

    return subjects.map((subject) => ({
      name: subject.name,
      teacherCount: subject.teachers.length,
      lessonCount: subject.lessons.length,
    }));
  }

  // بررسی نقش دانش‌آموز
  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      class: {
        include: {
          lessons: {
            include: {
              subject: {
                include: {
                  teachers: true, // اضافه کردن روابط معلمان در subject
                  lessons: true, // اضافه کردن روابط درس‌ها در subject
                },
              },
            },
          },
        },
      },
    },
  });

  if (student) {
    const subjects = student.class.lessons.map((lesson) => lesson.subject);

    return subjects.map((subject) => ({
      name: subject.name,
      teacherCount: subject.teachers?.length || 0,
      lessonCount: subject.lessons?.length || 0,
    }));
  }

  // بررسی نقش والد
  const parent = await prisma.parent.findUnique({
    where: { id: userId },
    include: {
      students: {
        include: {
          class: {
            include: {
              lessons: {
                include: {
                  subject: {
                    include: {
                      teachers: true, // اضافه کردن اطلاعات معلمان
                      lessons: true, // اضافه کردن اطلاعات درس‌ها
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (parent) {
    const subjects = parent.students.flatMap((student) =>
      student.class.lessons.map((lesson) => lesson.subject)
    );

    // حذف سابجکت‌های تکراری
    const uniqueSubjects = Array.from(
      new Map(subjects.map((subject) => [subject.id, subject])).values()
    );

    return uniqueSubjects.map((subject) => ({
      name: subject.name,
      teacherCount: subject.teachers?.length || 0,
      lessonCount: subject.lessons?.length || 0,
    }));
  }

  throw new Error("کاربر نقش مشخصی ندارد");
}

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
