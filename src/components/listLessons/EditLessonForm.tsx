"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";
import { teacherListProps } from "@/actions/dashboardAction";
import { AddLessonFormSchema, LessonsListSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Day, Prisma } from "@prisma/client";
import { EditLesson } from "@/actions/lessonsAction";
import { gradeListProps } from "@/db/queries/getGrade";
import TeacherSelectField from "../tableComponent/ReusableField/TeacherSelectField";
import ClassSelectField from "../tableComponent/ReusableField/ClassSelectField";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";
import SubjectSelectField from "../tableComponent/ReusableField/SubjectSelectField";
import WeekdaySelectField from "../tableComponent/ReusableField/WeekdaySelectField";
import TimeSelectField from "../tableComponent/ReusableField/TimeSelectField";

type Row<T> = {
  original: T;
};

interface EditLessonFormProps {
  teacherList?: teacherListProps[] | null;
  gradeList?: gradeListProps[] | null;
  onCancel: () => void;
  row: Row<LessonsListSchema>;
}

const EditLessonsForm = ({ onCancel, row }: EditLessonFormProps) => {
  const [teacherValue, setTeacherValue] = useState("");
  const [subjectValue, setSubjectValue] = useState("");
  const [classValue, setClassValue] = useState<string | undefined>("");

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      data,
      id,
    }: {
      data: Prisma.LessonUpdateInput;
      id: number;
    }) => EditLesson({ data, id }),
    onSuccess: (data) => {
      toast.success(data.message || "با موفقیت افزوده شد");
      onCancel();
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: (data) => {
      toast.error(data.message || "خطا");
    },
  });

  const startTime = row.original.startTime;
  const [startHour, startMinute] = startTime.split(":");
  const endTime = row.original.endTime;
  const [endHour, endMinute] = endTime.split(":");

  const form = useForm<z.infer<typeof AddLessonFormSchema>>({
    resolver: zodResolver(AddLessonFormSchema),
    defaultValues: {
      lessonName: row.original.lessonName,
      className: row.original.className,
      subjectName: row.original.subjectName,
      teacher: row.original.teacher.id,
      day: row.original.day,
      startHour: Number(startHour),
      startMinute: Number(startMinute),
      endHour: Number(endHour),
      endMinute: Number(endMinute),
    },
  });

  const onSubmit = async (data: z.infer<typeof AddLessonFormSchema>) => {
    const now = new Date();
    const startTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      data.startHour,
      data.startMinute
    );

    const endTime = new Date(
      now.getFullYear() + 1,
      now.getMonth(),
      now.getDate(),
      data.endHour,
      data.endMinute
    );

    const lessonData: Prisma.LessonUpdateInput = {
      name: data.lessonName,
      day: data.day as Day,
      startTime: startTime,
      endTime: endTime,
      class: {
        connect: { name: data.className },
      },
      subject: {
        connect: { name: data.subjectName },
      },
      teacher: {
        connect: { id: data.teacher },
      },
    };

    mutate({ data: lessonData, id: row.original.lessonId });
  };
  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <SimpleField
            form={form}
            name="lessonName"
            label="نام درس"
            description="حداکثر 20 حرف"
            defaultValue="ریاضی سال اول"
          />
          <SubjectSelectField
            form={form}
            fieldName="subjectName"
            formLable="انتخاب حوزه تدریس"
            description="حوزه تدریس را انتخاب کنید"
            subjectValue={subjectValue}
            setSubjectValue={setSubjectValue}
            row={row}
            rowKey="subjectName"
          />
          <WeekdaySelectField
            form={form}
            fieldName="day"
            formLable="انتخاب روز هفته"
            description="باید یک روز را انتخاب کنید"
            row={row}
            rowKey="day"
          />
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <TimeSelectField
              form={form}
              fieldName="startHour"
              hourFieldName="startHour"
              minuteFieldName="startMinute"
              formLable="زمان شروع کلاس"
            />
            <TimeSelectField
              form={form}
              fieldName="endHour"
              hourFieldName="endHour"
              minuteFieldName="endMinute"
              formLable="زمان پایان کلاس"
            />
          </div>
          <TeacherSelectField
            form={form}
            fieldName="teacher"
            setTeacherValue={setTeacherValue}
            teacherValue={teacherValue}
            row={row}
            rowKey="teacher"
          />
          <ClassSelectField
            form={form}
            classValue={classValue}
            setClassValue={setClassValue}
            fieldName="className"
            row={row}
            rowKey="className"
          />
          <div className="flex gap-2">
            <SubmitButton isPending={isPending} />
            <Button
              className="w-full hover:bg-orange-200"
              variant="outline"
              onClick={onCancel}
              type="button"
            >
              انصراف
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default EditLessonsForm;
