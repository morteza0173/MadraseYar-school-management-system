"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { StudentDataListSchema, StudentEditFormSchemas } from "@/lib/schemas";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditStudentData, getStudentInfo } from "@/actions/studentAction";
import ClassSelectField from "../tableComponent/ReusableField/ClassSelectField";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";
import RadioGroupField from "../tableComponent/ReusableField/RadioGroupField";
import UploadImageField from "../tableComponent/ReusableField/UploadImageField";

type Row<T> = {
  original: T;
};

interface EditStudentFormProps {
  onCancel: () => void;
  row: Row<StudentDataListSchema>;
}

const EditStudentForm = ({ onCancel, row }: EditStudentFormProps) => {
  const {
    data: studentInfo,
  } = useQuery({
    queryKey: ["studentInfo", row.original.id],
    queryFn: async () => getStudentInfo(row.original.id),
  });

  const [classValue, setClassValue] = useState<string | undefined>(
    row.original.class.name
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => EditStudentData(data),
    onSuccess: (data) => {
      toast.success(data.message || "دانش‌آموز با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["studentData"] });
      queryClient.invalidateQueries({ queryKey: ["studentInfo"] });

      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در ویرایش کردن دانش‌آموز");
    },
  });

  const form = useForm<z.infer<typeof StudentEditFormSchemas>>({
    resolver: zodResolver(StudentEditFormSchemas),
    defaultValues: {
      name: "در حال دریافت ...",
      surname: "در حال دریافت ...",
      username: "در حال دریافت ...",
      phone: row.original.phone,
      address: "در حال دریافت ...",
      image: row.original.label.img || "",
      classValue: row.original.class.name,
    },
  });

  useEffect(() => {
    if (studentInfo) {
      form.reset({
        name: studentInfo.name,
        surname: studentInfo.surname,
        username: studentInfo.username,
        phone: row.original.phone,
        address: studentInfo.address,
        image: row.original.label.img || "",
        sex: studentInfo.sex,
      });
    }
  }, [studentInfo, form, row]);

  const onSubmit = async (data: z.infer<typeof StudentEditFormSchemas>) => {
    const imagePrevUrl = row.original.label.img;
    const teacherId = row.original.id;
    const formData = new FormData();
    formData.append("id", teacherId!);
    formData.append("imagePrevUrl", imagePrevUrl!);
    formData.append("name", data.name);
    formData.append("surname", data.surname);
    formData.append("username", data.username);
    formData.append("phone", data.phone || "");
    formData.append("address", data.address);
    formData.append("image", data.image);
    formData.append("sex", data.sex);
    formData.append("classValue", data.classValue);

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
              type="number"
              defaultValue="09123456789"
              description="با 09 شروع میشودد"
            />
          </div>
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
          </div>
          <ClassSelectField
            form={form}
            fieldName="classValue"
            classValue={classValue}
            setClassValue={setClassValue}
          />
          <UploadImageField
            form={form}
            fieldName="image"
            disabledField={isPending}
            labelName="عکس دانش‌آموز"
            description="JPG,PNG,SVG یا JPEG و حداکثر 1 مگابایت"
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
export default EditStudentForm;
