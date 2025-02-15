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
