"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { SubjectFormSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubjectAction } from "@/actions/subjectAction";
import SubmitButton from "../SubmitButton";
import SimpleField from "../tableComponent/ReusableField/SimpleField";

interface RowData {
  name: string;
}

type Row<T> = {
  original: T;
};

interface DataTableRowActionsProps {
  row: Row<RowData>;
  onCancel: () => void;
}

const EditSubjectForm = ({ onCancel, row }: DataTableRowActionsProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => updateSubjectAction(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success(data.message || "با موفقیت ثبت شد");
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در ثبت");
    },
  });

  const form = useForm<z.infer<typeof SubjectFormSchema>>({
    resolver: zodResolver(SubjectFormSchema),
    defaultValues: {
      name: row.original.name,
    },
  });

  const onSubmit = async (data: z.infer<typeof SubjectFormSchema>) => {
    const formData = new FormData();
    formData.set("newSubjectName", data.name);
    formData.set("oldSubjectName", row.original.name);
    mutate(formData);
  };
  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <SimpleField
            form={form}
            name="name"
            label="حوزه تدریس"
            defaultValue="ریاضی"
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
export default EditSubjectForm;
