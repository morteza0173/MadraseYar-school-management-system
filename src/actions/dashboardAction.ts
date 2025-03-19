"use server";

import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabaseClient";
import { $Enums } from "@prisma/client";
import { cookies } from "next/headers";
import { cache } from "react";

export interface getUserInfoProps {
  id: string;
  role: string;
  name: string;
  address?: string;
  email: string | null;
  username: string;
  surname?: string;
  phone: string | null;
  userId?: string;
  nationalCode?: string;
  img: string | null;
  sex?: $Enums.UserSex;
  createdAt?: Date;
}

export interface teacherListProps {
  name: string;
  address: string;
  img: string | null;
  id: string;
  email: string | null;
  username: string;
  phone: string | null;
  surname: string;
  sex: $Enums.UserSex;
  createdAt: Date;
  role: string;
}

export const getUserInfoApi = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user?.id) return [];
  const userRole = await prisma.users.findFirst({
    where: {
      id: data.user.id,
    },
  });

  if (!userRole?.role) {
    return [];
  }

  if (userRole.role === "admin") {
    const adminInfo = await prisma.admin.findFirst({
      where: {
        id: data.user.id,
      },
    });

    if (!adminInfo) return [];

    const userInfo = { ...adminInfo, ...userRole };
    return userInfo;
  }
  if (userRole.role === "teacher") {
    const teacherInfo = await prisma.teacher.findFirst({
      where: {
        id: data.user.id,
      },
    });

    if (!teacherInfo) return [];

    const userInfo = { ...teacherInfo, ...userRole };
    return userInfo;
  }

  return [];
});

export const getUserInfo = async () => {
  const cookie = cookies().toString();

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user?.id) return;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/userInfo`, {
    method: "GET",
    headers: { Cookie: cookie },
    next: {
      revalidate: 60 * 60 * 24 * 90,
      tags: ["userInfo", `userInfo-${data.user.id}`],
    },
  });
  if (!res.ok) throw new Error("خطایی در دریافت اطلاعات کاربری رخ داد");
  return res.json();
};

export async function getStudents() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/students`, {
    next: { revalidate: 60 * 60 * 24 * 90, tags: ["students"] },
  });

  if (!data.ok) throw new Error("خطا در گرفتن اطلاعات دانش آموزان");

  return data.json();
}

export type teacherProps = {
  name: string;
  id: string;
  username: string;
  phone: string | null;
  email: string | null;
  img: string | null;
  surname: string;
  address: string;
  sex: $Enums.UserSex;
  createdAt: Date;
};

export async function getTeacher() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/teachers`, {
    next: { revalidate: 60 * 60 * 24 * 90, tags: ["teachers"] },
  });

  if (!data.ok) throw new Error("خطا در گرفتن اطلاعات معلم");

  const teacher: teacherProps[] = await data.json();
  return teacher;
}

export async function getAdmins() {
  const data = await prisma.admin.findMany();

  return data;
}

export async function getEvents() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`, {
    next: { revalidate: 60 * 60 * 24 * 90, tags: ["events"] },
  });

  if (!data.ok) throw new Error("خطا در گرفتن اطلاعات رویداد");

  const events = await data.json();
  return events;
}
