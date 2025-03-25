"use server";

import { prisma } from "@/lib/db";
import {
  createClient,
  createClientWithServiceRole,
} from "@/lib/supabaseClient";
import { UserSex } from "@prisma/client";

export interface FormattedStudent {
  id: string;
  label: {
    name: string;
    email?: string | undefined;
    img?: string | undefined;
  };
  phone?: string | undefined;
  address: string;
  sex: UserSex;
  parent: {
    id: string;
    name: string;
  };
  class: {
    id: number;
    name: string;
  };
  grade: number;
  upcomingAssignments: number;
  upcomingExams: number;
  averageScore: number;
}

export async function getStudentData(userId: string) {
  const now = new Date();

  // بررسی نقش ادمین
  const admin = await prisma.admin.findUnique({ where: { id: userId } });
  if (admin) {
    // دسترسی کامل برای ادمین
    const students = await prisma.student.findMany({
      include: {
        class: {
          include: {
            grade: true,
          },
        },
        parent: true,
        results: {
          include: {
            assignment: true,
            exam: true,
          },
        },
      },
    });

    return students.map((s) => {
      const upcomingAssignments = s.results.filter(
        (result) =>
          result.assignment && new Date(result.assignment.DueDate) > now
      ).length;
      const upcomingExams = s.results.filter(
        (result) => result.exam && new Date(result.exam.startTime) > now
      ).length;
      const averageScore =
        s.results.reduce((acc, result) => acc + result.score, 0) /
        s.results.length;

      return {
        id: s.id,
        label: {
          name: `${s.name} ${s.surname}`,
          email: s.email || undefined,
          img: s.img || undefined,
        },
        phone: s.phone || undefined,
        address: s.address,
        sex: s.sex,
        parent: {
          id: s.parent.id,
          name: `${s.parent.name} ${s.parent.surname}`,
        },
        class: {
          id: s.class.id,
          name: s.class.name,
        },
        grade: s.class.grade.level,
        upcomingAssignments,
        upcomingExams,
        averageScore,
      };
    });
  }

  // بررسی نقش معلم
  const teacher = await prisma.teacher.findUnique({
    where: { id: userId },
    include: {
      classes: {
        include: {
          student: {
            include: {
              class: {
                include: {
                  grade: true,
                },
              },
              parent: true,
              results: {
                include: {
                  assignment: true,
                  exam: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (teacher) {
    // دسترسی معلم به دانش‌آموزان کلاس‌های خودش
    const students = teacher.classes.flatMap((cls) => cls.student);

    return students.map((s) => {
      const upcomingAssignments = s.results.filter(
        (result) =>
          result.assignment && new Date(result.assignment.DueDate) > now
      ).length;
      const upcomingExams = s.results.filter(
        (result) => result.exam && new Date(result.exam.startTime) > now
      ).length;
      const averageScore =
        s.results.reduce((acc, result) => acc + result.score, 0) /
        s.results.length;

      return {
        id: s.id,
        label: {
          name: `${s.name} ${s.surname}`,
          email: s.email || undefined,
          img: s.img || undefined,
        },
        phone: s.phone || undefined,
        address: s.address,
        sex: s.sex,
        parent: {
          id: s.parent.id,
          name: `${s.parent.name} ${s.parent.surname}`,
        },
        class: {
          id: s.class.id,
          name: s.class.name,
        },
        grade: s.class.grade.level,
        upcomingAssignments,
        upcomingExams,
        averageScore,
      };
    });
  }

  // بررسی نقش دانش‌آموز
  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      class: {
        include: {
          student: {
            include: {
              class: {
                include: {
                  grade: true,
                },
              },
              parent: true,
              results: {
                include: {
                  assignment: true,
                  exam: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (student) {
    // دسترسی دانش‌آموز به هم‌کلاسی‌های خودش
    const classmates = student.class.student;

    return classmates.map((s) => {
      const upcomingAssignments = s.results.filter(
        (result) =>
          result.assignment && new Date(result.assignment.DueDate) > now
      ).length;
      const upcomingExams = s.results.filter(
        (result) => result.exam && new Date(result.exam.startTime) > now
      ).length;
      const averageScore =
        s.results.reduce((acc, result) => acc + result.score, 0) /
        s.results.length;

      return {
        id: s.id,
        label: {
          name: `${s.name} ${s.surname}`,
          email: s.email || undefined,
          img: s.img || undefined,
        },
        phone: s.phone || undefined,
        address: s.address,
        sex: s.sex,
        parent: {
          id: s.parent.id,
          name: `${s.parent.name} ${s.parent.surname}`,
        },
        class: {
          id: s.class.id,
          name: s.class.name,
        },
        grade: s.class.grade.level,
        upcomingAssignments,
        upcomingExams,
        averageScore,
      };
    });
  }

  // بررسی نقش والد
  const parent = await prisma.parent.findUnique({
    where: { id: userId },
    include: {
      students: {
        include: {
          class: {
            include: {
              student: {
                include: {
                  class: {
                    include: {
                      grade: true,
                    },
                  },
                  parent: true,
                  results: {
                    include: {
                      assignment: true,
                      exam: true,
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
    // دسترسی والد به دانش‌آموزان خودش و هم‌کلاسی‌های آن‌ها
    const students = parent.students.flatMap((s) => s.class.student);

    return students.map((s) => {
      const upcomingAssignments = s.results.filter(
        (result) =>
          result.assignment && new Date(result.assignment.DueDate) > now
      ).length;
      const upcomingExams = s.results.filter(
        (result) => result.exam && new Date(result.exam.startTime) > now
      ).length;
      const averageScore =
        s.results.reduce((acc, result) => acc + result.score, 0) /
        s.results.length;

      return {
        id: s.id,
        label: {
          name: `${s.name} ${s.surname}`,
          email: s.email || undefined,
          img: s.img || undefined,
        },
        phone: s.phone || undefined,
        address: s.address,
        sex: s.sex,
        parent: {
          id: s.parent.id,
          name: `${s.parent.name} ${s.parent.surname}`,
        },
        class: {
          id: s.class.id,
          name: s.class.name,
        },
        grade: s.class.grade.level,
        upcomingAssignments,
        upcomingExams,
        averageScore,
      };
    });
  }

  // در صورت عدم تطابق نقش، آرایه خالی برگردانده می‌شود
  return [];
}

export async function AddStudentData(formData: FormData) {
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
  const parentId = formData.get("parent") as string;
  const className = formData.get("classValue") as string;

  try {
    const classData = await prisma.class.findUnique({
      where: { name: className },
      include: { grade: true },
    });

    if (!classData) {
      throw new Error(`کلاس با نام ${className} یافت نشد`);
    }

    const classId = classData.id;
    const gradeId = classData.grade.id;

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
      await prisma.users.create({
        data: {
          id: userId!,
          role: "student",
        },
      });

      await prisma.student.create({
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
          parentId,
          classId,
          gradeId,
        },
      });
    });

    return { message: "دانش‌آموز با موفقیت ثبت شد" };
  } catch {
    throw new Error(`خطا در ثبت دانش‌آموز`);
  }
}

export async function getStudentInfo(id: string) {
  const student = await prisma.student.findUnique({
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
      parent: {
        select: {
          id: true,
          name: true,
          surname: true,
        },
      },
      class: {
        select: {
          id: true,
          name: true,
          grade: {
            select: {
              id: true,
              level: true,
            },
          },
        },
      },
    },
  });

  if (!student) {
    throw new Error("دانش‌آموز با این شناسه یافت نشد");
  }

  return {
    name: student.name,
    surname: student.surname,
    username: student.username,
    email: student.email,
    phone: student.phone,
    address: student.address,
    img: student.img,
    sex: student.sex,
    parent: student.parent
      ? {
          id: student.parent.id,
          name: student.parent.name,
          surname: student.parent.surname,
        }
      : null,
    class: student.class
      ? {
          id: student.class.id,
          name: student.class.name,
          grade: {
            id: student.class.grade.id,
            name: student.class.grade.level,
          },
        }
      : null,
  };
}

export async function EditStudentData(formData: FormData) {
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
  const parentId = formData.get("parent") as string;
  const className = formData.get("classValue") as string;

  let imageUrl: string | null = typeof image === "string" ? image : null;
  try {
    // Get classId and gradeId using className
    const classData = await prisma.class.findUnique({
      where: { name: className },
      include: { grade: true },
    });

    if (!classData) {
      throw new Error(`کلاس با نام ${className} یافت نشد`);
    }

    const classId = classData.id;
    const gradeId = classData.grade.id;

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

    await prisma.student.update({
      where: { id: String(id) },
      data: {
        address,
        img: imageUrl,
        name,
        phone,
        sex,
        surname,
        username,
        parentId,
        classId,
        gradeId,
      },
    });

    return { message: "دانش‌آموز با موفقیت بروزرسانی شد" };
  } catch {
    throw new Error(`خطا در بروزرسانی دانش‌آموز`);
  }
}

export async function DeleteStudentData(formData: FormData) {
  const supabase = await createClientWithServiceRole();

  const id = formData.get("id") as string;

  try {
    if (!id) {
      throw new Error("شناسه دانش‌آموز (id) ارائه نشده است");
    }

    const student = await prisma.student.findUnique({
      where: { id: String(id) },
      select: { img: true },
    });

    if (!student) {
      throw new Error("دانش‌آموز با این شناسه یافت نشد");
    }

    if (student.img) {
      const imagePath = student.img.split(
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
      // حذف از جدول Student
      await prisma.student.delete({
        where: { id: String(id) },
      });

      // حذف از جدول Users
      await prisma.users.delete({
        where: { id: String(id) },
      });
    });

    return { message: "دانش‌آموز با موفقیت حذف شد" };
  } catch {
    throw new Error(`خطا در حذف دانش‌آموز`);
  }
}
