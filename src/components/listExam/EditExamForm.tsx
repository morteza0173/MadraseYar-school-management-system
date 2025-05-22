"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { examEditFormSchemas } from "@/lib/schemas";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditExamData } from "@/actions/examAction";
import { ExamsProps } from "@/db/queries/getExams";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";
import DatepickerField from "../tableComponent/ReusableField/DatepickerField";
import LessonSelectField from "../tableComponent/ReusableField/LessonSelectField";

type Row<T> = {
  original: T;
};

interface EditStudentFormProps {
  onCancel: () => void;
  row: Row<ExamsProps>;
}

const EditExamForm = ({ onCancel, row }: EditStudentFormProps) => {
  const [lessonValue, setLessonValue] = useState<number | undefined>(
    row.original.lessonId
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => EditExamData(data),
    onSuccess: (data) => {
      toast.success(data.message || "امتحان با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["exams"] });

      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در ویرایش کردن امتحان");
    },
  });

  const form = useForm<z.infer<typeof examEditFormSchemas>>({
    resolver: zodResolver(examEditFormSchemas),
    defaultValues: {
      title: row.original.title,
      startTime: row.original.startTime,
      lessonId: String(row.original.lessonId),
    },
  });

  const onSubmit = async (data: z.infer<typeof examEditFormSchemas>) => {
    const formData = new FormData();
    formData.append("id", row.original.id.toString());
    formData.append("title", data.title);
    formData.append("startTime", data.startTime.toString());
    formData.append("lessonId", data.lessonId.toString());

    mutate(formData);
  };

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-row gap-4 ">
            <SimpleField
              form={form}
              name="title"
              label="عنوان"
              description="حداکثر 20 حرف"
            />
          </div>
          <DatepickerField
            form={form}
            fieldName="startTime"
            formLabel="تاریخ امتحان"
          />
          <LessonSelectField
            form={form}
            lessonValue={lessonValue}
            setLessonValue={setLessonValue}
            fieldName="lessonId"
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
export default EditExamForm;
