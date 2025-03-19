import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = body;
  if (!userId) {
    return NextResponse.json(
      { error: "شناسه کاربر ارسال شده یافت نشد" },
      { status: 400 }
    );
  }

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

    const result = subjects.map((subject) => ({
      name: subject.name,
      teacherCount: subject.teachers.length,
      lessonCount: subject.lessons.length,
    }));

    return NextResponse.json(result)
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

    const result = subjects.map((subject) => ({
      name: subject.name,
      teacherCount: subject.teachers.length,
      lessonCount: subject.lessons.length,
    }));

    return NextResponse.json(result)
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

    const result = subjects.map((subject) => ({
      name: subject.name,
      teacherCount: subject.teachers?.length || 0,
      lessonCount: subject.lessons?.length || 0,
    }));

    return NextResponse.json(result)
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

    const result = uniqueSubjects.map((subject) => ({
      name: subject.name,
      teacherCount: subject.teachers?.length || 0,
      lessonCount: subject.lessons?.length || 0,
    }));
    return NextResponse.json(result)
  }

  throw new Error("کاربر نقش مشخصی ندارد");
}
