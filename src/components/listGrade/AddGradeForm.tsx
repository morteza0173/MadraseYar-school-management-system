"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { AddGrade } from "@/actions/gradeActions";
import { toast } from "sonner";
import { GradeFormSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";
const AddGradeForm = ({ onCancel }: { onCancel: () => void }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => AddGrade(data),
    onSuccess: (data) => {
      toast.success(data.message || "با موفقیت ثبت شد");
      queryClient.invalidateQueries({ queryKey: ["grade"] });
      queryClient.invalidateQueries({ queryKey: ["classDetails"] });
      onCancel();
    },
    onError: (data) => {
      toast.error(data.message || "خطا در ثبت");
    },
  });

  const form = useForm<z.infer<typeof GradeFormSchema>>({
    resolver: zodResolver(GradeFormSchema),
    defaultValues: {
      grade: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof GradeFormSchema>) => {
    const formData = new FormData();
    formData.set("grade", data.grade);
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
export default AddGradeForm;
