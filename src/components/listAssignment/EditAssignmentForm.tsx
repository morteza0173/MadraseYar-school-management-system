"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { assignmentEditFormSchemas } from "@/lib/schemas";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditAssignmentData } from "@/actions/assignmentAction";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";
import DatepickerField from "../tableComponent/ReusableField/DatepickerField";
import LessonSelectField from "../tableComponent/ReusableField/LessonSelectField";

type Row<T> = {
  original: T;
};

type examProps = {
  id: number;
  title: string;
  startDate: Date;
  dueDate: Date;
  className: string;
  lessonName: string;
  lessonId?: number | undefined;
  classId?: number | undefined;
};

interface EditStudentFormProps {
  onCancel: () => void;
  row: Row<examProps>;
}

const EditAssignmentForm = ({ onCancel, row }: EditStudentFormProps) => {
  const [lessonValue, setLessonValue] = useState<number | undefined>(
    row.original.lessonId
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => EditAssignmentData(data),
    onSuccess: (data) => {
      toast.success(data.message || "تکلیف با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["assignments"] });

      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در ویرایش کردن تکلیف");
    },
  });

  const form = useForm<z.infer<typeof assignmentEditFormSchemas>>({
    resolver: zodResolver(assignmentEditFormSchemas),
    defaultValues: {
      title: row.original.title,
      dueDate: row.original.dueDate,
      lessonId: String(row.original.lessonId),
    },
  });

  const onSubmit = async (data: z.infer<typeof assignmentEditFormSchemas>) => {
    const formData = new FormData();
    formData.append("id", row.original.id.toString());
    formData.append("title", data.title);
    formData.append("dueDate", data.dueDate.toString());
    formData.append("lessonId", data.lessonId.toString());

    mutate(formData);
  };

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-row gap-4 ">
            <SimpleField form={form} name="title" label="عنوان" />
          </div>
          <DatepickerField
            form={form}
            fieldName="dueDate"
            formLabel="تاریخ تحویل تکلیف"
          />
          <LessonSelectField
            form={form}
            fieldName="lessonId"
            lessonValue={lessonValue}
            setLessonValue={setLessonValue}
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
export default EditAssignmentForm;
