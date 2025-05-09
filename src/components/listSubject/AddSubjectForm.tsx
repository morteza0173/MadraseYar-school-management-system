"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { SubjectFormSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubjectAction } from "@/actions/subjectAction";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";
const AddSubjectForm = ({ onCancel }: { onCancel: () => void }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => createSubjectAction(data),
    onSuccess: (data) => {
      toast.success(data.message || "با موفقیت ثبت شد");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      onCancel();
    },
    onError: (data) => {
      toast.error(data.message || "خطا در ثبت");
    },
  });

  const form = useForm<z.infer<typeof SubjectFormSchema>>({
    resolver: zodResolver(SubjectFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SubjectFormSchema>) => {
    const formData = new FormData();
    formData.set("subjectName", data.name);
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
export default AddSubjectForm;
