import { prisma } from "@/lib/db";
import { Teacher, Assignment, Exam } from "@prisma/client";

export interface FormattedTeacher {
  id: string;
  label: {
    name: string;
    email?: string;
    img?: string;
  };
  phone?: string;
  subject?: string;
  classes: string;
  eventOnGoing: number;
}

// تابع اصلی
export async function getTeacherData(
  userId: string
): Promise<FormattedTeacher[]> {
  const [admin, teacher] = await Promise.all([
    prisma.admin.findUnique({ where: { id: userId } }),
    prisma.teacher.findUnique({ where: { id: userId } }),
  ]);

  if (admin || teacher) {
    return getAllTeachersFormatted();
  }

  const studentTeachers = await getStudentTeachers(userId);
  if (studentTeachers.length) return studentTeachers;

  const parentTeachers = await getParentTeachers(userId);
  if (parentTeachers.length) return parentTeachers;

  return [];
}


const now = new Date();

function countUpcoming(assignments: Assignment[], exams: Exam[]): number {
  const upcomingAssignments = assignments.filter(
    (a) => new Date(a.DueDate) > now
  ).length;
  const upcomingExams = exams.filter((e) => new Date(e.startTime) > now).length;
  return upcomingAssignments + upcomingExams;
}

function formatTeacherBase(
  t: Teacher,
  subject?: string,
  className?: string
): FormattedTeacher {
  return {
    id: t.id,
    label: {
      name: `${t.name} ${t.surname}`,
      email: t.email || undefined,
      img: t.img || undefined,
    },
    phone: t.phone || undefined,
    subject: subject || "ندارد",
    classes: className || "",
    eventOnGoing: 0,
  };
}

// ✅ برای ادمین یا معلم
async function getAllTeachersFormatted(): Promise<FormattedTeacher[]> {
  const [teachers, classes] = await Promise.all([
    prisma.teacher.findMany({
      include: {
        subjects: true,
        classes: true,
        lessons: {
          include: { assignment: true, exams: true },
        },
      },
    }),
    prisma.class.findMany({ select: { id: true, name: true } }),
  ]);

  const classMap = new Map(classes.map((cls) => [cls.id, cls.name]));

  return teachers.map((t) => {
    const classSet = new Set<string>();
    let eventCount = 0;

    t.lessons.forEach((lesson) => {
      if (lesson.classId && classMap.has(lesson.classId)) {
        classSet.add(classMap.get(lesson.classId)!);
      }
      eventCount += countUpcoming(lesson.assignment, lesson.exams);
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
      eventOnGoing: eventCount,
    };
  });
}

// ✅ برای دانش‌آموز
async function getStudentTeachers(userId: string): Promise<FormattedTeacher[]> {
  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      class: {
        include: {
          lessons: {
            include: {
              subject: true,
              assignment: true,
              exams: true,
            },
          },
        },
      },
    },
  });

  if (!student) return [];

  const teacherIds = Array.from(
    new Set(student.class.lessons.map((l) => l.teacherId))
  );

  const teachers = await prisma.teacher.findMany({
    where: { id: { in: teacherIds } },
  });

  const teacherMap: Record<string, FormattedTeacher> = {};

  student.class.lessons.forEach((lesson) => {
    const teacher = teachers.find((t) => t.id === lesson.teacherId);
    if (!teacher) return;

    if (!teacherMap[teacher.id]) {
      teacherMap[teacher.id] = formatTeacherBase(
        teacher,
        lesson.subject?.name,
        student.class.name
      );
    }

    teacherMap[teacher.id].eventOnGoing += countUpcoming(
      lesson.assignment,
      lesson.exams
    );
  });

  return Object.values(teacherMap);
}

// ✅ برای خانوار
async function getParentTeachers(userId: string): Promise<FormattedTeacher[]> {
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

  if (!parent) return [];

  const allLessons = parent.students.flatMap((s) =>
    s.class.lessons.map((lesson) => ({
      lesson,
      className: s.class.name,
    }))
  );

  const teacherIds = Array.from(
    new Set(allLessons.map(({ lesson }) => lesson.teacherId))
  );

  const teachers = await prisma.teacher.findMany({
    where: { id: { in: teacherIds } },
  });

  const teacherMap: Record<string, FormattedTeacher> = {};

  allLessons.forEach(({ lesson, className }) => {
    const teacher = teachers.find((t) => t.id === lesson.teacherId);
    if (!teacher) return;

    if (!teacherMap[teacher.id]) {
      teacherMap[teacher.id] = formatTeacherBase(
        teacher,
        lesson.subject?.name,
        className
      );
    }

    teacherMap[teacher.id].eventOnGoing += countUpcoming(
      lesson.assignment,
      lesson.exams
    );
  });

  return Object.values(teacherMap);
}
