"use server";

import { prisma } from "@/lib/db";
import {
  createClient,
  createClientWithServiceRole,
} from "@/lib/supabaseClient";
import { UserSex } from "@prisma/client";

export interface FormattedTeacher {
  id: string;
  label: {
    name: string;
    email?: string | undefined;
    img?: string | undefined;
  };
  phone?: string | undefined;
  subject?: string | undefined;
  classes: string;
  eventOnGoing: number;
}

export async function getTeacherData(userId: string) {
  const now = new Date();

  // بررسی نقش ادمین و معلم
  const admin = await prisma.admin.findUnique({ where: { id: userId } });
  const teacherUser = await prisma.teacher.findUnique({
    where: { id: userId },
  });

  const classes = await prisma.class.findMany({
    select: { id: true, name: true },
  });

  if (admin || teacherUser) {
    // دسترسی کامل برای ادمین و معلم
    const teachers = await prisma.teacher.findMany({
      include: {
        subjects: true,
        classes: true,
        lessons: {
          include: {
            assignment: true,
            exams: true,
          },
        },
      },
    });

    const classMap = new Map(classes.map((cls) => [cls.id, cls.name]));

    const formatted = teachers.map((t) => {
      let upcomingAssignments = 0;
      let upcomingExams = 0;

      const classSet = new Set();

      t.lessons.forEach((lesson) => {
        if (lesson.classId && classMap.has(lesson.classId)) {
          classSet.add(classMap.get(lesson.classId));
        }

        upcomingAssignments += lesson.assignment.filter(
          (assignment) => new Date(assignment.DueDate) > now
        ).length;
        upcomingExams += lesson.exams.filter(
          (exam) => new Date(exam.startTime) > now
        ).length;
      });

      return {
        id: t.id,
        label: {
          name: `${t.name} ${t.surname}`,
          email: t.email || undefined,
          img: t.img || undefined,
        },
        phone: t.phone || undefined,
        subject: t.subjects[0]?.name || "ندارد",
        classes: Array.from(classSet).join(" , "),
        eventOnGoing: upcomingAssignments + upcomingExams,
      };
    });
    return formatted;
  }

  // بررسی نقش دانش‌آموز
  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      class: {
        include: {
          lessons: {
            include: {
              subject: true,
              teacher: true,
              assignment: true,
              exams: true,
            },
          },
        },
      },
    },
  });
  if (student) {
    // برای دانش‌آموز: تنها معلم‌های کلاس دانش‌آموز
    const lessons = student.class.lessons;
    const teacherMap: Record<string, FormattedTeacher> = {};

    lessons.forEach((lesson) => {
      const t = lesson.teacher;
      if (!teacherMap[t.id]) {
        teacherMap[t.id] = {
          id: t.id,
          label: {
            name: `${t.name} ${t.surname}`,
            email: t.email || undefined,
            img: t.img || undefined,
          },
          phone: t.phone || undefined,
          subject: lesson.subject?.name || "ندارد",
          classes: student.class.name,
          eventOnGoing: 0,
        };
      }
      teacherMap[t.id].eventOnGoing +=
        lesson.assignment.filter(
          (assignment) => new Date(assignment.DueDate) > now
        ).length +
        lesson.exams.filter((exam) => new Date(exam.startTime) > now).length;
    });
    return Object.values(teacherMap);
  }

  // بررسی نقش والد (خانوار)
  const parent = await prisma.parent.findUnique({
    where: { id: userId },
    include: {
      students: {
        include: {
          class: {
            include: {
              lessons: {
                include: {
                  subject: true,
                  teacher: true,
                  assignment: true,
                  exams: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (parent) {
    // برای خانوار: تنها معلم‌های فرزندان
    const teacherMap: Record<string, FormattedTeacher> = {};

    parent.students.forEach((student) => {
      student.class.lessons.forEach((lesson) => {
        const t = lesson.teacher;
        if (!teacherMap[t.id]) {
          teacherMap[t.id] = {
            id: t.id,
            label: {
              name: `${t.name} ${t.surname}`,
              email: t.email || undefined,
              img: t.img || undefined,
            },
            phone: t.phone || undefined,
            subject: lesson.subject?.name || "ندارد",
            classes: student.class.name,
            eventOnGoing: 0,
          };
        }
        teacherMap[t.id].eventOnGoing +=
          lesson.assignment.filter(
            (assignment) => new Date(assignment.DueDate) > now
          ).length +
          lesson.exams.filter((exam) => new Date(exam.startTime) > now).length;
      });
    });
    return Object.values(teacherMap);
  }

  // در صورت عدم تطابق نقش، آرایه خالی برگردانده می‌شود
  return [];
}

export async function AddTeacherData(formData: FormData) {
  const supabase = await createClientWithServiceRole();

  const address = formData.get("address") as string;
  const image = formData.get("image") as File;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const sex = formData.get("sex") as UserSex;
  const surname = formData.get("surname") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const subjectName = formData.get("subject") as string;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    throw new Error(`خطا در ساخت حساب کاربری: ${authError.message}`);
  }

  const userId = user?.id;

  const { error: uploadError } = await supabase.storage
    .from("profile-images")
    .upload(`${userId}/${image?.name}`, image);

  if (uploadError) {
    throw new Error(`خطا در آپلود عکس: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("profile-images")
    .getPublicUrl(`${userId}/${image.name}`);

  await prisma.$transaction(async (prisma) => {
    const subject = await prisma.subject.findUnique({
      where: { name: subjectName },
    });

    await prisma.users.create({
      data: {
        id: userId!,
        role: "teacher",
      },
    });

    await prisma.teacher.create({
      data: {
        id: userId!,
        username,
        name,
        surname,
        email,
        phone,
        address,
        img: publicUrl,
        sex,
        subjects: {
          connect: { id: subject?.id },
        },
      },
    });
  });

  return { message: "معلم با موفقیت ثبت شد" };
}

export async function getTeacherInfo(id: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    select: {
      name: true,
      surname: true,
      username: true,
      email: true,
      phone: true,
      address: true,
      img: true,
      sex: true,
    },
  });
  return teacher;
}

export async function EditTeacherData(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const address = formData.get("address") as string;
  const image = formData.get("image") as File;
  const imagePrevUrl = formData.get("imagePrevUrl") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const sex = formData.get("sex") as UserSex;
  const surname = formData.get("surname") as string;
  const username = formData.get("username") as string;
  const subjectName = formData.get("subject") as string;

  let imageUrl: string | null = typeof image === "string" ? image : null;
  try {
    if (image instanceof File) {
      if (imagePrevUrl && typeof imagePrevUrl === "string") {
        const prevPath = imagePrevUrl.split("/storage/v1/object/public/")[1];
        const { error: deleteError } = await supabase.storage
          .from("profile-images")
          .remove([prevPath]);

        if (deleteError) {
          throw new Error(`خطا در حذف تصویر قبلی: ${deleteError.message}`);
        }
      }
      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(`${id}/${image?.name}`, image, {
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`خطا در آپلود تصویر: ${uploadError.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("profile-images")
        .getPublicUrl(`${id}/${image.name}`);

      imageUrl = publicUrl;
    }

    const subject = await prisma.subject.findUnique({
      where: { name: subjectName },
    });

    await prisma.teacher.update({
      where: { id: String(id) },
      data: {
        address,
        img: imageUrl,
        name,
        phone,
        sex,
        surname,
        username,
        subjects: {
          connect: { id: subject?.id },
        },
      },
    });

    return { message: "معلم با موفقیت بروزرسانی شد" };
  } catch {
    throw new Error(`خطا در بروزرسانی معلم`);
  }
}

export async function DeleteTeacherData(formData: FormData) {
  const supabase = await createClientWithServiceRole();

  const id = formData.get("id") as string;

  try {
    if (!id) {
      throw new Error("شناسه معلم (id) ارائه نشده است");
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: String(id) },
      select: { img: true },
    });

    if (!teacher) {
      throw new Error("معلم با این شناسه یافت نشد");
    }

    if (teacher.img) {
      const imagePath = teacher.img.split(
        "/storage/v1/object/public/profile-images"
      )[1];
      const { error: deleteImageError } = await supabase.storage
        .from("profile-images")
        .remove([imagePath]);

      if (deleteImageError) {
        throw new Error(`خطا در حذف تصویر: ${deleteImageError.message}`);
      }
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
      throw new Error(`خطا در حذف حساب کاربری: ${authError.message}`);
    }

    await prisma.$transaction(async (prisma) => {
      // حذف از جدول Teacher
      await prisma.teacher.delete({
        where: { id: String(id) },
      });

      // حذف از جدول Users
      await prisma.users.delete({
        where: { id: String(id) },
      });
    });

    return { message: "معلم با موفقیت حذف شد" };
  } catch {
    throw new Error(`خطا در حذف معلم `);
  }
}
