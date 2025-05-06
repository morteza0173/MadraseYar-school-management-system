"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";
import { AddClass } from "@/actions/classAction";
import { AddClassFormSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ClassListSimpleField, {
  FieldConfig,
} from "./form-fields/classListSimpleField";
import ClassListSelectTeacherField from "./form-fields/classListSelectTeacherField";
import ClassListSelectGradeField from "./form-fields/ClassListSelectGradeField";
import SubmitButton from "../SubmitButton";

const classNameField: FieldConfig = {
  name: "className",
  label: "نام کلاس",
  defaultValue: "10B",
  description: "حداکثر شامل 20 حرف",
};
const capacityField: FieldConfig = {
  name: "capacity",
  label: "ظرفیت کلاس",
  defaultValue: "15",
  type: "number",
  description: "حداقل باید 1 نفر باشد",
};

interface AddClassFormProps {
  onCancel: () => void;
}

const AddClassForm = ({ onCancel }: AddClassFormProps) => {
  const [supervisorValue, setSupervisorValue] = useState("");
  const [gradeValue, setGradeValue] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => AddClass(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["classDetails"] });
      toast.success(data.message || "کلاس جدید با موفقیت ساخته شد");
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "مشکلی در ثبت کلاس جدید به وجود آمد");
    },
  });

  const form = useForm<z.infer<typeof AddClassFormSchema>>({
    resolver: zodResolver(AddClassFormSchema),
    defaultValues: {
      className: "",
      capacity: "",
      supervisorId: "",
      grade: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof AddClassFormSchema>) => {
    const formData = new FormData();
    formData.set("className", data.className);
    formData.set("capacity", data.capacity);
    formData.set("supervisor", data.supervisorId);
    formData.set("grade", data.grade);
    mutate(formData);
  };

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ClassListSimpleField form={form} field={classNameField} />
          <ClassListSimpleField form={form} field={capacityField} />
          <ClassListSelectTeacherField
            form={form}
            supervisorValue={supervisorValue}
            setSupervisorValue={setSupervisorValue}
          />
          <ClassListSelectGradeField
            form={form}
            gradeValue={gradeValue}
            setGradeValue={setGradeValue}
          />
          <div className="flex gap-2">
            <SubmitButton text="ثبت" isPending={isPending} />
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
export default AddClassForm;
