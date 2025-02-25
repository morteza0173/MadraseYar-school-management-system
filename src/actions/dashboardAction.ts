"use server";

import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabaseClient";
import { $Enums } from "@prisma/client";
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

export const getUserInfo = cache(
  async (): Promise<getUserInfoProps| undefined> => {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user?.id) return;
    const userRole = await prisma.users.findFirst({
      where: {
        id: data.user.id,
      },
    });

    if (!userRole?.role) {
      return;
    }

    if (userRole.role === "admin") {
      const adminInfo = await prisma.admin.findFirst({
        where: {
          id: data.user.id,
        },
      });

      if (!adminInfo) return;

      const userInfo = { ...adminInfo, ...userRole };
      return userInfo;
    }
    if (userRole.role === "teacher") {
      const teacherInfo = await prisma.teacher.findFirst({
        where: {
          id: data.user.id,
        },
      });

      if (!teacherInfo) return;

      const userInfo = { ...teacherInfo, ...userRole };
      return userInfo;
    }

    return;
  }
);

export async function getStudents() {
  const data = await prisma.student.findMany();

  return data;
}

export async function getTeacher() {
  const data = await prisma.teacher.findMany();

  return data;
}

export async function getAdmins() {
  const data = await prisma.admin.findMany();

  return data;
}

export async function getEvents() {
  const data = await prisma.event.findMany();

  return data;
}
