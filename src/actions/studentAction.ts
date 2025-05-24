"use server";

import { prisma } from "@/lib/db";
import {
  createClient,
  createClientWithServiceRole,
} from "@/lib/supabaseClient";
import { UserSex } from "@prisma/client";

export async function addStudentAndParent(formData: FormData) {
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
  const className = formData.get("classValue") as string;

  const fatherName = formData.get("fatherName") as string;
  const fatherUsername = formData.get("fatherUsername") as string;
  const fatherPassword = formData.get("fatherPassword") as string;
  const fatherEmail = formData.get("fatherEmail") as string;
  const fatherPhone = formData.get("fatherPhone") as string;

  const classData = await prisma.class.findUnique({
    where: { name: className },
    include: { grade: true },
  });

  if (!classData) {
    throw new Error(`کلاس با نام ${className} یافت نشد`);
  }

  const classId = classData.id;
  const gradeId = classData.grade.id;

  const { data: fatherAuth, error: fatherAuthError } =
    await supabase.auth.admin.createUser({
      email: fatherEmail,
      password: fatherPassword,
      email_confirm: true,
    });

  if (fatherAuthError || !fatherAuth?.user?.id) {
    throw new Error("خطا در ایجاد حساب پدر");
  }

  const fatherId = fatherAuth.user.id;

  const { data: studentAuth, error: studentAuthError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (studentAuthError || !studentAuth?.user?.id) {
    throw new Error("خطا در ایجاد حساب دانش‌آموز");
  }

  const studentId = studentAuth.user.id;

  const { error: uploadError } = await supabase.storage
    .from("profile-images")
    .upload(`${studentId}/${image?.name}`, image);

  if (uploadError) {
    throw new Error("خطا در آپلود عکس");
  }

  const { data: publicImage } = supabase.storage
    .from("profile-images")
    .getPublicUrl(`${studentId}/${image.name}`);

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.users.create({
        data: {
          id: fatherId,
          role: "parent",
        },
      });
      await prisma.users.create({
        data: {
          id: studentId!,
          role: "student",
        },
      });

      await prisma.parent.create({
        data: {
          id: fatherId!,
          username: fatherUsername,
          name: fatherName,
          surname,
          email: fatherEmail,
          phone: fatherPhone,
          address,
        },
      });

      await prisma.student.create({
        data: {
          id: studentId!,
          username,
          name,
          surname,
          email,
          phone,
          address,
          img: publicImage.publicUrl,
          sex,
          parentId: fatherId,
          classId,
          gradeId,
        },
      });
    });
  } catch {
    throw new Error("خطای در حین ثبت اطلاعات رخ داد");
  }

  return { message: "دانش‌آموز و پدر با موفقیت ثبت شدند" };
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
