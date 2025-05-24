"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TeacherFormSchemas } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddTeacherData } from "@/actions/teacherAction";
import { toast } from "sonner";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";
import RadioGroupField from "../tableComponent/ReusableField/RadioGroupField";
import UploadImageField from "../tableComponent/ReusableField/UploadImageField";
import SubjectSelectField from "../tableComponent/ReusableField/SubjectSelectField";
import { useState } from "react";
const AddTeacherForm = ({ onCancel }: { onCancel: () => void }) => {
  const [subjectValue, setSubjectValue] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => AddTeacherData(data),
    onSuccess: (data) => {
      toast.success(data.message || "معلم با موفقیت اضافه شد");
      queryClient.invalidateQueries({ queryKey: ["teacherData"] });
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در اضافه کردن معلم");
    },
  });

  const form = useForm<z.infer<typeof TeacherFormSchemas>>({
    resolver: zodResolver(TeacherFormSchemas),
    defaultValues: {
      name: "",
      surname: "",
      username: "",
      phone: "",
      password: "",
      address: "",
      image: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof TeacherFormSchemas>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("surname", data.surname);
    formData.append("username", data.username);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("address", data.address);
    formData.append("image", data.image);
    formData.append("address", data.address);
    formData.append("email", data.email);
    formData.append("sex", data.sex);
    formData.append("subject", subjectValue);

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
              name="password"
              label="رمز عبور"
              type="password"
            />
          </div>
          <SimpleField form={form} name="email" label="ایمیل" type="email" />
          <SimpleField
            form={form}
            name="address"
            label="آدرس"
            type="textarea"
            defaultValue="ادرس خود را وارد کنید ..."
          />
          <div className="flex flex-row gap-4">
            <RadioGroupField fieldName="sex" form={form} labelName="جنسیت">
              <RadioGroupField.Option label="مرد" value="MALE" />
              <RadioGroupField.Option label="زن" value="FEMALE" />
            </RadioGroupField>
            <SimpleField
              form={form}
              name="phone"
              label="شماره تماس"
              description="با 09 شروع میشود"
              type="number"
              defaultValue="09123456789"
            />
          </div>
          <SubjectSelectField
            form={form}
            fieldName="subject"
            subjectValue={subjectValue}
            setSubjectValue={setSubjectValue}
            formLable="حوزه تدریس معلم"
            description="تخصص معلم در تدریس کدام درس است ؟"
          />
          <UploadImageField
            form={form}
            fieldName="image"
            labelName="تصویر معلم"
            description="JPG,PNG,SVG یا JPEG و حداکثر 1 مگابایت"
            disabledField={isPending}
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
export default AddTeacherForm;
