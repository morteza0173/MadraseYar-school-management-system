"use server";

import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabaseClient";
import { cache } from "react";

export interface getUserInfoProps {
  id: string;
  role: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  userId: string;
  nationalCode: string;
  img: string | null;
}

export const getUserInfo = cache(async (): Promise<getUserInfoProps | undefined> => {
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

  return;
});

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
