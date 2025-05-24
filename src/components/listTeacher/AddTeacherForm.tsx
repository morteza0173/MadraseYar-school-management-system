"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { ImageIcon } from "lucide-react";
import { TeacherFormSchemas } from "@/lib/schemas";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddTeacherData } from "@/actions/teacherAction";
import { toast } from "sonner";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";
import RadioGroupField from "../tableComponent/ReusableField/RadioGroupField";
const AddTeacherForm = ({ onCancel }: { onCancel: () => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
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

    mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
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
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-5">
                  {field.value ? (
                    <div className="size-[72px] relative rounded-md overflow-hidden">
                      <Image
                        src={
                          field.value instanceof File
                            ? URL.createObjectURL(field.value)
                            : field.value
                        }
                        alt="teacher avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <Avatar className="size-[72px]">
                      <AvatarFallback>
                        <ImageIcon className="size-[36px] text-neutral-400" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col gap-y-1">
                    <p>عکس معلم</p>
                    <p className="text-xs text-muted-foreground">
                      JPG,PNG,SVG یا JPEG و حداکثر 1 مگابایت
                    </p>
                    <input
                      className="hidden"
                      accept=".jpg , .png , .jpeg , .svg"
                      type="file"
                      ref={inputRef}
                      onChange={handleImageChange}
                      disabled={isPending}
                    />
                    {field.value ? (
                      <Button
                        size="sm"
                        type="button"
                        disabled={isPending}
                        variant="destructive"
                        className="w-fit mt-2"
                        onClick={() => {
                          field.onChange(null);
                          if (inputRef.current) {
                            inputRef.current.value = "";
                          }
                        }}
                      >
                        حذف تصویر
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        type="button"
                        disabled={isPending}
                        variant="secondary"
                        className="w-fit mt-2 bg-sky-400 hover:bg-sky-300 "
                        onClick={() => inputRef.current?.click()}
                      >
                        آپلود تصویر
                      </Button>
                    )}
                    <FormMessage />
                  </div>
                </div>
              </div>
            )}
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
