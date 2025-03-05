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
  lessonId: z.number(),
  lessonName: z.string(),
  subjectName: z.string(),
  teacher: TeacherSchema,
  className: z.string(),
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export type LessonsListSchema = z.infer<typeof lessonsListSchema>;

const TeacherLabel = z.object({
  name: z.string(),
  email: z.string().optional(),
  img: z.string().optional(),
});

export const teacherDataListSchema = z.object({
  id: z.string(),
  label: TeacherLabel,
  phone: z.string().optional(),
  subject: z.string().optional(),
  classes: z.string(),
  eventOnGoing: z.number(),
});

export type TeacherDataListSchema = z.infer<typeof teacherDataListSchema>;

export const parentDataListSchema = z.object({
  id: z.string(),
  phone: z.string(),
  address: z.string(),
  name: z.string(),
  surname: z.string(),
  username: z.string(),
  email: z.string() || null,
  createdAt: z.date(),
});

export type ParentDataListSchema = z.infer<typeof parentDataListSchema>;

export const TeacherFormSchemas = z.object({
  name: z.string().min(1, "نام نمی‌تواند خالی باشد"),
  email: z.string().min(1, "ایمیل نمی‌تواند خالی باشد"),
  surname: z.string().min(1, "نام خانوادگی نمی‌تواند خالی باشد"),
  username: z.string().min(1, "نام کاربری نمی‌تواند خالی باشد"),
  password: z.string().min(1, "پسورد حساب کاربری نمی‌تواند خالی باشد"),
  address: z.string().min(1, "آدرس نمی‌تواند خالی باشد"),
  sex: z.enum(["MALE", "FEMALE"], {
    message: "جنسیت معلم را انتخاب کنید",
  }),
  phone: z.string().regex(/^09\d{9}$/, {
    message: "شماره تلفن باید 11 رقم و با 09 شروع شود.",
  }),
  image: z
    .instanceof(File, { message: "لطفاً یک فایل معتبر انتخاب کنید." })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/jpg", "image/svg"].includes(
          file.type
        ),
      {
        message: "فقط فایل‌های jpg یا png یا svg مجاز هستند.",
      }
    )
    .refine((file) => file.size <= 1024 * 1024, {
      message: "حجم فایل نباید بیشتر از 1 مگابایت باشد.",
    }),
});

export const TeacherEditFormSchemas = z.object({
  name: z.string().min(1, "نام نمی‌تواند خالی باشد"),
  surname: z.string().min(1, "نام خانوادگی نمی‌تواند خالی باشد"),
  username: z.string().min(1, "نام کاربری نمی‌تواند خالی باشد"),
  address: z.string().min(1, "آدرس نمی‌تواند خالی باشد"),
  sex: z.enum(["MALE", "FEMALE"], {
    message: "جنسیت معلم را انتخاب کنید",
  }),
  phone: z.string().regex(/^09\d{9}$/, {
    message: "شماره تلفن باید 11 رقم و با 09 شروع شود.",
  }),
  image: z.union([
    z
      .instanceof(File, { message: "لطفاً یک فایل معتبر انتخاب کنید." })
      .refine(
        (file) =>
          ["image/jpeg", "image/png", "image/jpg", "image/svg"].includes(
            file.type
          ),
        {
          message: "فقط فایل‌های jpg یا png یا svg مجاز هستند.",
        }
      )
      .refine((file) => file.size <= 1024 * 1024, {
        message: "حجم فایل نباید بیشتر از 1 مگابایت باشد.",
      }),
    z.string(),
  ]),
});

export const ParentFormSchemas = z.object({
  name: z.string().min(1, "نام نمی‌تواند خالی باشد"),
  email: z.string().min(1, "ایمیل نمی‌تواند خالی باشد"),
  surname: z.string().min(1, "نام خانوادگی نمی‌تواند خالی باشد"),
  username: z.string().min(1, "نام کاربری نمی‌تواند خالی باشد"),
  password: z.string().min(1, "پسورد حساب کاربری نمی‌تواند خالی باشد"),
  address: z.string().min(1, "آدرس نمی‌تواند خالی باشد"),
  phone: z.string().regex(/^09\d{9}$/, {
    message: "شماره تلفن باید 11 رقم و با 09 شروع شود.",
  }),
});

export const ParentEditFormSchemas = z.object({
  name: z.string().min(1, "نام نمی‌تواند خالی باشد"),
  surname: z.string().min(1, "نام خانوادگی نمی‌تواند خالی باشد"),
  username: z.string().min(1, "نام کاربری نمی‌تواند خالی باشد"),
  address: z.string().min(1, "آدرس نمی‌تواند خالی باشد"),
  phone: z.string().regex(/^09\d{9}$/, {
    message: "شماره تلفن باید 11 رقم و با 09 شروع شود.",
  }),
});
