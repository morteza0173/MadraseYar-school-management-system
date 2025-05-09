"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { announcementFormSchemas } from "@/lib/schemas";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditAnnouncementData } from "@/actions/announcementAction";
import ClassSelectField from "../tableComponent/ReusableField/ClassSelectField";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";

type Row<T> = {
  original: T;
};

type announcementProps = {
  id: number;
  title: string;
  description: string;
  className: string;
  date: Date;
};

interface EditStudentFormProps {
  onCancel: () => void;
  row: Row<announcementProps>;
}

const EditAnnouncementForm = ({ onCancel, row }: EditStudentFormProps) => {
  const [classValue, setClassValue] = useState<string | undefined>(
    row.original.className
  );
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => EditAnnouncementData(data),
    onSuccess: (data) => {
      toast.success(data.message || "اعلامیه با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });

      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در ویرایش کردن اعلامیه");
    },
  });

  const form = useForm<z.infer<typeof announcementFormSchemas>>({
    resolver: zodResolver(announcementFormSchemas),
    defaultValues: {
      title: row.original.title,
      description: row.original.description,
      className: row.original.className,
    },
  });

  const onSubmit = async (data: z.infer<typeof announcementFormSchemas>) => {
    const formData = new FormData();
    formData.append("id", row.original.id.toString());
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("className", data.className || "");

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
          <SimpleField
            form={form}
            name="description"
            label="توضیحات"
            type="textarea"
          />
          <ClassSelectField
            form={form}
            classValue={classValue}
            setClassValue={setClassValue}
            fieldName="className"
            hasClearButton
            description="اگر کلاسی انتخاب نکنید به عنوان اعلامیه عمومی برای همه ارسال میشود"
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
export default EditAnnouncementForm;
