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

export type AddClassFormSchemaProps = z.infer<typeof AddClassFormSchema>;

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

const StudentLabel = z.object({
  name: z.string(),
  email: z.string().optional(),
  img: z.string().optional(),
});

export const studentDataListSchema = z.object({
  id: z.string(),
  label: StudentLabel,
  phone: z.string().optional(),
  subject: z.string().optional(),
  address: z.string(),
  sex: z.enum(["MALE", "FEMALE"]),
  parent: z.object({
    id: z.string(),
    name: z.string(),
  }),
  class: z.object({
    id: z.number(),
    name: z.string(),
  }),
  grade: z.number(),
  upcomingAssignments: z.number(),
  upcomingExams: z.number(),
  averageScore: z.number(),
});

export type StudentDataListSchema = z.infer<typeof studentDataListSchema>;

const Student = z.object({
  id: z.string(),
  name: z.string(),
});

export const resultDataListSchema = z.object({
  id: z.number(),
  student: Student,
  classId: z.number().optional(),
  className: z.string(),
  score: z.number(),
  createdAt: z.date(),
  type: z.string(),
  relatedId: z.number().optional(),
  relatedTitle: z.string(),
  relatedDate: z.date().optional(),
  lessonId: z.number().optional(),
  lessonName: z.string(),
});

export type ResultDataListSchema = z.infer<typeof resultDataListSchema>;

export const announcementDataListSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  date: z.date(),
  className: z.string(),
});

export type AnnouncementDataListSchema = z.infer<
  typeof announcementDataListSchema
>;

export const eventDataListSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  className: z.string(),
});

export type EventDataListSchema = z.infer<typeof eventDataListSchema>;

export const examDataListSchema = z.object({
  id: z.number(),
  title: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  lessonName: z.string(),
  className: z.string(),
  lessonId: z.number().optional(),
  classId: z.number().optional(),
});

export type ExamDataListSchema = z.infer<typeof examDataListSchema>;

export const assignmentDataListSchema = z.object({
  id: z.number(),
  title: z.string(),
  startDate: z.date(),
  dueDate: z.date(),
  lessonName: z.string(),
  className: z.string(),
  lessonId: z.number().optional(),
  classId: z.number().optional(),
});

export type AssignmentDataListSchema = z.infer<typeof assignmentDataListSchema>;

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
  subject: z.string().nonempty("باید حوزه تدریس را انتخاب کنید"),
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
  subject: z.string().nonempty("باید حوزه تدریس را انتخاب کنید"),
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

export const StudentFormSchemas = z.object({
  name: z.string().min(1, "نام نمی‌تواند خالی باشد"),
  fatherName: z.string().min(1, "نام پدر نمی‌تواند خالی باشد"),
  email: z.string().min(1, "ایمیل نمی‌تواند خالی باشد"),
  surname: z.string().min(1, "نام خانوادگی نمی‌تواند خالی باشد"),
  fatherUsername: z.string().min(1, "نام کاربری پدر نمی‌تواند خالی باشد"),
  username: z.string().min(1, "نام کاربری نمی‌تواند خالی باشد"),
  password: z.string().min(1, "پسورد حساب کاربری نمی‌تواند خالی باشد"),
  fatherPassword: z.string().min(1, "رمز عبور پدر نمی‌تواند خالی باشد"),
  fatherEmail: z.string().min(1, "ایمیل پدر نمی‌تواند خالی باشد"),
  address: z.string().min(1, "آدرس نمی‌تواند خالی باشد"),
  sex: z.enum(["MALE", "FEMALE"], {
    message: "جنسیت دانش‌آموز را انتخاب کنید",
  }),
  phone: z
    .string()
    .regex(/^09\d{9}$/, {
      message: "شماره تلفن باید 11 رقم و با 09 شروع شود.",
    })
    .optional(),
  fatherPhone: z.string().regex(/^09\d{9}$/, {
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
  classValue: z.string().nonempty("باید یک کلاس انتخاب کنید"),
});

export const StudentEditFormSchemas = z.object({
  name: z.string().min(1, "نام نمی‌تواند خالی باشد"),
  surname: z.string().min(1, "نام خانوادگی نمی‌تواند خالی باشد"),
  username: z.string().min(1, "نام کاربری نمی‌تواند خالی باشد"),
  address: z.string().min(1, "آدرس نمی‌تواند خالی باشد"),
  sex: z.enum(["MALE", "FEMALE"], {
    message: "جنسیت دانش‌آموز را انتخاب کنید",
  }),
  phone: z
    .string()

    .regex(/^09\d{9}$/, {
      message: "شماره تلفن باید 11 رقم و با 09 شروع شود.",
    })
    .optional(),
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
  classValue: z.string().nonempty("باید یک کلاس انتخاب کنید"),
});

export const announcementFormSchemas = z.object({
  title: z
    .string()
    .min(1, "نمیتواند خالی باشد")
    .max(20, "نام نمی‌تواند بیشتر از 20 حرف باشد"),
  description: z.string().min(1, "توضیحات نمی‌تواند خالی باشد"),
  className: z.string().optional(),
});

export const eventFormSchemas = z.object({
  title: z
    .string()
    .min(1, "نمیتواند خالی باشد")
    .max(20, "نام نمی‌تواند بیشتر از 20 حرف باشد"),
  description: z.string().min(1, "توضیحات نمی‌تواند خالی باشد"),
  startTime: z
    .string({ required_error: "لطفا تاریخ را انتخاب کنید" })
    .min(1, "لطفا تاریخ را انتخاب کنید"),
  className: z.string().optional(),
});

export const eventEditFormSchemas = eventFormSchemas.extend({
  startTime: z.union([
    z.date({ required_error: "لطفا تاریخ را انتخاب کنید" }),
    z
      .string({ required_error: "لطفا تاریخ را انتخاب کنید" })
      .min(1, "لطفا تاریخ را انتخاب کنید"),
  ]),
});

export type EventEditFormSchemas = z.infer<typeof eventEditFormSchemas>;

export const examFormSchemas = z.object({
  title: z.string().min(1, "نمیتواند خالی باشد"),
  startTime: z
    .string({ required_error: "لطفا تاریخ را انتخاب کنید" })
    .min(1, "لطفا تاریخ را انتخاب کنید"),
  lessonId: z.string().min(1, "لطفا درس را انتخاب کنید"),
});

export const examEditFormSchemas = examFormSchemas.extend({
  startTime: z.union([
    z.date({ required_error: "لطفا تاریخ را انتخاب کنید" }),
    z
      .string({ required_error: "لطفا تاریخ را انتخاب کنید" })
      .min(1, "لطفا تاریخ را انتخاب کنید"),
  ]),
});

export type ExamEditFormSchemas = z.infer<typeof examEditFormSchemas>;

export const assignmentFormSchemas = z.object({
  title: z.string().min(1, "نمیتواند خالی باشد"),
  dueDate: z
    .string({ required_error: "لطفا تاریخ را انتخاب کنید" })
    .min(1, "لطفا تاریخ را انتخاب کنید"),
  lessonId: z.string().min(1, "لطفا درس را انتخاب کنید"),
});

export const assignmentEditFormSchemas = assignmentFormSchemas.extend({
  dueDate: z.union([
    z.date({ required_error: "لطفا تاریخ را انتخاب کنید" }),
    z
      .string({ required_error: "لطفا تاریخ را انتخاب کنید" })
      .min(1, "لطفا تاریخ را انتخاب کنید"),
  ]),
});
