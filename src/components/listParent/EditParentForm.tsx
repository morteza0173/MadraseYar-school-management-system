"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ParentEditFormSchemas } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditParentData } from "@/actions/parentAction";
import { ParentSingleType } from "@/db/queries/getParent";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";

type Row<T> = {
  original: T;
};

interface EditParentFormProps {
  onCancel: () => void;
  row: Row<ParentSingleType>;
}

const EditParentForm = ({ onCancel, row }: EditParentFormProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => EditParentData(data),
    onSuccess: (data) => {
      toast.success(data.message || "والد با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["parent"] });
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در ویرایش کردن والد");
    },
  });

  const form = useForm<z.infer<typeof ParentEditFormSchemas>>({
    resolver: zodResolver(ParentEditFormSchemas),
    defaultValues: {
      name: row.original.name,
      surname: row.original.surname,
      phone: row.original.phone,
      address: row.original.address,
      username: row.original.username,
    },
  });

  const onSubmit = async (data: z.infer<typeof ParentEditFormSchemas>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("surname", data.surname);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("username", data.username);
    formData.append("id", row.original.id);

    mutate(formData);
  };

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-row gap-4 ">
            <SimpleField form={form} name="name" label="نام" />
            <SimpleField form={form} name="surname" label="نام خانوادگی" />
          </div>
          <div className="flex flex-row gap-4">
            <SimpleField form={form} name="username" label="نام کاربری" />
            <SimpleField
              form={form}
              name="phone"
              label="شماره تماس"
              type="text"
              description="با 09 شروع میشود"
            />
          </div>
          <SimpleField
            form={form}
            name="address"
            label="آدرس"
            type="textarea"
            defaultValue="آدرس خود را وارد کنید ..."
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
export default EditParentForm;
