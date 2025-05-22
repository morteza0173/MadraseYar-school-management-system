"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { assignmentFormSchemas } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { AddAssignmentData } from "@/actions/assignmentAction";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";
import DatepickerField from "../tableComponent/ReusableField/DatepickerField";
import LessonSelectField from "../tableComponent/ReusableField/LessonSelectField";

const AddAssignmentForm = ({ onCancel }: { onCancel: () => void }) => {
  const [lessonValue, setLessonValue] = useState<number | undefined>(undefined);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => AddAssignmentData(data),
    onSuccess: (data) => {
      toast.success(data.message || "تکلیف با موفقیت اضافه شد");
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در اضافه کردن تکلیف");
    },
  });

  const form = useForm<z.infer<typeof assignmentFormSchemas>>({
    resolver: zodResolver(assignmentFormSchemas),
    defaultValues: {
      title: "",
      lessonId: "",
      dueDate: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof assignmentFormSchemas>) => {
    console.log(data);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("dueDate", data.dueDate);
    formData.append("lessonId", data.lessonId);

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
export default AddAssignmentForm;
