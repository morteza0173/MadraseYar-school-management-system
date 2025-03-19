"use server";

import { prisma } from "@/lib/db";
import {
  createClient,
  createClientWithServiceRole,
} from "@/lib/supabaseClient";
import { UserSex } from "@prisma/client";
import { revalidateTag } from "next/cache";

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
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/teachers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
    next: {
      revalidate: 60 * 60 * 24 * 90,
      tags: [`teachersList`, `teachersList-${userId}`],
    },
  });

  if (!res.ok) throw new Error("دریافت اطلاعات لیست معلم ها با خطا مواجه شد");

  const result: FormattedTeacher[] = await res.json();
  return result;
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

  try {
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
        },
      });
    });
    await revalidateTag("teachersList");

    return { message: "معلم با موفقیت ثبت شد" };
  } catch {
    throw new Error(`خطا در ثبت معلم`);
  }
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
      },
    });
    await revalidateTag("teachersList");

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
    await revalidateTag("teachersList");

    return { message: "معلم با موفقیت حذف شد" };
  } catch {
    throw new Error(`خطا در حذف معلم `);
  }
}
