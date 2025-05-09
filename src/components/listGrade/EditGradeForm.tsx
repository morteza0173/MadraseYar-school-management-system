"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { EditGrade } from "@/actions/gradeActions";
import { toast } from "sonner";
import { GradeFormSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";

interface RowData {
  id: number;
  level: number;
  students: number;
  classes: number;
}

type Row<T> = {
  original: T;
};

interface DataTableRowActionsProps {
  row: Row<RowData>;
  onCancel: () => void;
}

const EditGradeForm = ({ onCancel, row }: DataTableRowActionsProps) => {
  const queryClient = useQueryClient();

  const {mutate,isPending} = useMutation({
    mutationFn: async (data: FormData) => EditGrade(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["grade"] });
      queryClient.invalidateQueries({ queryKey: ["classDetails"] });
      toast.success(data.message || "با موفقیت ثبت شد");
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در ثبت");
    },
  });

  const form = useForm<z.infer<typeof GradeFormSchema>>({
    resolver: zodResolver(GradeFormSchema),
    defaultValues: {
      grade: row.original.level.toString(),
    },
  });

  const onSubmit = async (data: z.infer<typeof GradeFormSchema>) => {
    const formData = new FormData();
    formData.set("grade", data.grade);
    formData.set("gradeId", row.original.id.toString());
    mutate(formData);
  };
  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <SimpleField
            form={form}
            name="grade"
            label="سال تحصیلی"
            type="number"
            defaultValue="12"
            description="به صورت عدد وارد کنید"
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
export default EditGradeForm;
