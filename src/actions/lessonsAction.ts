"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";

type teacher = {
  id: string;
  name: string;
};

export interface getLessonsDataProps {
  lessonId: number;
  lessonName: string;
  subjectName: string;
  className: string;
  day: string;
  startTime: string;
  endTime: string;
  teacher: teacher;
}

export async function getLessonsData(userId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lessons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
    next: {
      revalidate: 60 * 60 * 24 * 90,
      tags: [`lessons`, `lessons-${userId}`],
    },
  });

  if (!res.ok) throw new Error("دریافت اطلاعات درس ها با خطا مواجه شد");

  const result: getLessonsDataProps[] = await res.json();
  return result;
}

export async function AddLesson(data: Prisma.LessonCreateInput) {
  try {
    await prisma.lesson.create({ data });
    revalidateTag("lessons");
    return {
      message: "درس جدید با موفقیت ایجاد شد و به برنامه هفتگی افزوده شد",
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function EditLesson({
  data,
  id,
}: {
  data: Prisma.LessonUpdateInput;
  id: number;
}) {
  try {
    await prisma.lesson.update({
      where: { id },
      data,
    });
    revalidateTag("lessons");

    return {
      message: "درس با موفقیت ویرایش شد",
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function DeleteLesson(formData: FormData) {
  const id = formData.get("id");
  const idNumber = Number(id);
  try {
    await prisma.lesson.delete({
      where: { id: idNumber },
    });
    revalidateTag("lessons");

    return {
      message: "درس با موفقیت حذف شد",
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function DeleteLessons(ids: number[]) {
  try {
    await prisma.lesson.deleteMany({
      where: { id: { in: ids } },
    });
    revalidateTag("lessons");

    return {
      message: "درس‌ها با موفقیت حذف شدند",
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}
