"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";
import { teacherListProps } from "@/actions/dashboardAction";
import { EditClass } from "@/actions/classAction";
import { AddClassFormSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gradeListProps } from "@/db/queries/getGrade";
import ClassListSimpleField, {
  FieldConfig,
} from "./form-fields/classListSimpleField";
import ClassListSelectGradeField from "./form-fields/ClassListSelectGradeField";
import SubmitButton from "../SubmitButton";
import TeacherSelectField from "../tableComponent/ReusableField/TeacherSelectField";

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

interface RowData {
  name: string;
  grade: number;
  capacity: number;
  studentCount: number;
  supervisor?: string;
}

type Row<T> = {
  original: T;
};

interface EditeClassFormProps {
  teacherList?: teacherListProps[] | null;
  gradeList?: gradeListProps[] | null;
  onCancel: () => void;
  row: Row<RowData>;
}

const EditClassForm = ({ onCancel, row }: EditeClassFormProps) => {
  const [gradeValue, setGradeValue] = useState("");
  const [supervisorValue, setSupervisorValue] = useState("");

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => EditClass(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["classDetails"] });
      toast.success(data.message || "کلاس با موفقیت ویرایش شد");
      onCancel();
    },
    onError: (data) => {
      toast.error(data.message || "مشکلی در ویرایش کلاس به وجود آمد");
    },
  });

  const form = useForm<z.infer<typeof AddClassFormSchema>>({
    resolver: zodResolver(AddClassFormSchema),
    defaultValues: {
      className: row.original.name,
      capacity: row.original.capacity.toString(),
      supervisorId: row.original.supervisor,
      grade: row.original.grade.toString(),
    },
  });

  const onSubmit = async (data: z.infer<typeof AddClassFormSchema>) => {
    const formData = new FormData();
    formData.set("classId", row.original.name);
    formData.set("className", data.className);
    formData.set("capacity", data.capacity);
    formData.set("supervisor", supervisorValue);
    formData.set("grade", gradeValue);
    mutate(formData);
  };
  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ClassListSimpleField form={form} field={classNameField} />
          <ClassListSimpleField form={form} field={capacityField} />
          <TeacherSelectField
            form={form}
            row={row}
            teacherValue={supervisorValue}
            setTeacherValue={setSupervisorValue}
            fieldName="supervisorId"
            rowKey="supervisor"
          />
          <ClassListSelectGradeField
            form={form}
            gradeValue={gradeValue}
            setGradeValue={setGradeValue}
            row={row}
          />
          <div className="flex gap-2">
            <SubmitButton text="ویرایش" isPending={isPending} />
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
export default EditClassForm;
