import { z } from "zod";

export const AddClassFormSchema = z.object({
  className: z
    .string()
    .nonempty("نام کلاس نمی‌تواند خالی باشد.")
    .max(20, "حداکثر 20 حرف میتواند باشد"),
  capacity: z
    .string()
    .nonempty("ظرفیت را مشخص کنید")
    .refine((val) => {
      const num = Number(val);
      return num > 0;
    }, "ظرفیت باید حداقل شامل 1 نفر باشد"),
  supervisorId: z
    .string()
    .nonempty("باید یک معلم را به عنوان مشاور انتخاب کنید"),
  grade: z.string().nonempty("باید سال تحصیلی را انتخاب کنید"),
});

export const AddLessonFormSchema = z
  .object({
    lessonName: z
      .string()
      .nonempty("نام درس نمی‌تواند خالی باشد.")
      .max(20, "حداکثر 20 حرف میتواند باشد"),
    day: z
      .string()
      .refine(
        (value) =>
          ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY"].includes(
            value
          ),
        {
          message: "لطفا یک روز معتبر از شنبه تا چهارشنبه انتخاب کنید",
        }
      ),
    teacher: z.string().nonempty("باید یک معلم را انتخاب کنید"),
    className: z.string().nonempty("باید سال تحصیلی را انتخاب کنید"),
    subjectName: z.string().nonempty("باید حوزه تدریس را انتخاب کنید"),
    startHour: z.number().min(0).max(23),
    startMinute: z.number().min(0).max(59),
    endHour: z.number().min(0).max(23),
    endMinute: z.number().min(0).max(59),
  })
  .refine(
    (data) => {
      const startTime = data.startHour * 60 + data.startMinute;
      const endTime = data.endHour * 60 + data.endMinute;
      return endTime > startTime;
    },
    {
      message: "زمان پایان نباید قبل از زمان شروع باشد",
      path: ["endHour"],
    }
  );

export const GradeFormSchema = z.object({
  grade: z
    .string()
    .nonempty("سال تحصیلی نمی‌تواند خالی باشد.")
    .refine((val) => {
      const num = Number(val);
      return num > 0;
    }, "سال تحصیلی باید بزرگ‌تر از صفر باشد."),
});

export const SubjectFormSchema = z.object({
  name: z.string().min(1, "سال تحصیلی نمی‌تواند خالی باشد"),
});

export const classListSchema = z.object({
  name: z.string(),
  grade: z.number(),
  capacity: z.number(),
  studentCount: z.number(),
  supervisor: z.string(),
});

export type ClassListSchema = z.infer<typeof classListSchema>;

export const subjectListSchema = z.object({
  name: z.string(),
  teacherCount: z.number(),
  lessonCount: z.number(),
});

export type SubjectListSchema = z.infer<typeof subjectListSchema>;

export const gradeListSchema = z.object({
  id: z.number(),
  level: z.number(),
  students: z.number(),
  classes: z.number(),
});

export type GradeListSchema = z.infer<typeof gradeListSchema>;

const TeacherSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const lessonsListSchema = z.object({
  lessonId:z.number(),
  lessonName: z.string(),
  subjectName: z.string(),
  teacher: TeacherSchema,
  className: z.string(),
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export type LessonsListSchema = z.infer<typeof lessonsListSchema>;
