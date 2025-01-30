import { prisma } from "@/lib/db";
import { getUserInfoProps } from "./dashboardAction";

export async function getClassDetails(user: getUserInfoProps) {
  if (!user) {
    throw new Error("کاربر یافت نشد!");
  }

  let classFilter = {};

  if (user.role === "ADMIN") {
  } else if (user.role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({
      where: { id: user.id },
      select: { classes: { select: { id: true } } },
    });

    if (!teacher) return [];

    classFilter = {
      id: { in: teacher.classes.map((cls) => cls.id) },
    };
  } else if (user.role === "PARENT") {
    const parent = await prisma.parent.findUnique({
      where: { id: user.id },
      select: {
        students: {
          select: { classId: true },
        },
      },
    });

    if (!parent) return [];

    classFilter = {
      id: { in: parent.students.map((student) => student.classId) },
    };
  } else if (user.role === "STUDENT") {
    const student = await prisma.student.findUnique({
      where: { id: user.id },
      select: { classId: true },
    });

    if (!student) return [];

    classFilter = { id: student.classId };
  }



  const classDetails = await prisma.class.findMany({
    where: classFilter,
    select: {
      name: true, // نام کلاس
      grade: {
        select: {
          level: true, // سال تحصیلی
        },
      },
      capacity: true, // ظرفیت کلاس
      student: {
        select: {
          id: true,
        },
      },
      supervisor: {
        select: {
          name: true, // نام مشاور کلاس
          surname: true, // نام خانوادگی مشاور
        },
      },
    },
  });

  return classDetails.map((cls) => ({
    name: cls.name,
    grade: cls.grade.level,
    capacity: cls.capacity,
    studentCount: cls.student.length, // تعداد دانش‌آموزان
    supervisor: `${cls.supervisor.name} ${cls.supervisor.surname}`, // نام کامل مشاور
  }));
}
