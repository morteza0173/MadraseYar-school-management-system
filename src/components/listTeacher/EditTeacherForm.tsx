"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TeacherDataListSchema, TeacherEditFormSchemas } from "@/lib/schemas";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditTeacherData, getTeacherInfo } from "@/actions/teacherAction";
import { toast } from "sonner";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";
import RadioGroupField from "../tableComponent/ReusableField/RadioGroupField";
import UploadImageField from "../tableComponent/ReusableField/UploadImageField";
import SubjectSelectField from "../tableComponent/ReusableField/SubjectSelectField";

type Row<T> = {
  original: T;
};

interface EditTeacherFormProps {
  onCancel: () => void;
  row: Row<TeacherDataListSchema>;
}

const EditTeacherForm = ({ onCancel, row }: EditTeacherFormProps) => {
  const [subjectValue, setSubjectValue] = useState("");

  const { data: teacherInfo, isPending: teacherInfoPending } = useQuery({
    queryKey: ["teacherInfo", row.original.id],
    queryFn: async () => getTeacherInfo(row.original.id),
  });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => EditTeacherData(data),
    onSuccess: (data) => {
      toast.success(data.message || "معلم با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["teacherData"] });
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در ویرایش کردن معلم");
    },
  });

  const form = useForm<z.infer<typeof TeacherEditFormSchemas>>({
    resolver: zodResolver(TeacherEditFormSchemas),
    defaultValues: {
      name: "در حال دریافت ...",
      surname: "در حال دریافت ...",
      username: "در حال دریافت ...",
      phone: row.original.phone,
      address: "در حال دریافت ...",
      image: row.original.label.img,
      subject: row.original.subject,
    },
  });

  useEffect(() => {
    if (teacherInfo) {
      form.reset({
        name: teacherInfo.name,
        surname: teacherInfo.surname,
        username: teacherInfo.username,
        phone: row.original.phone,
        address: teacherInfo.address,
        image: row.original.label.img,
        sex: teacherInfo.sex,
        subject: row.original.subject,
      });
    }
  }, [teacherInfo, form, row]);

  const onSubmit = async (data: z.infer<typeof TeacherEditFormSchemas>) => {
    const imagePrevUrl = row.original.label.img;
    const teacherId = row.original.id;
    const formData = new FormData();
    formData.append("id", teacherId!);
    formData.append("imagePrevUrl", imagePrevUrl!);
    formData.append("name", data.name);
    formData.append("surname", data.surname);
    formData.append("username", data.username);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("image", data.image);
    formData.append("sex", data.sex);
    formData.append("subject", subjectValue);

    mutate(formData);
  };

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-row gap-4 ">
            <SimpleField
              form={form}
              name="name"
              label="نام"
              disabled={teacherInfoPending}
            />
            <SimpleField
              form={form}
              name="surname"
              label="نام خانوادگی"
              disabled={teacherInfoPending}
            />
          </div>
          <div className="flex flex-row gap-4">
            <SimpleField
              form={form}
              name="username"
              label="نام کاربری"
              disabled={teacherInfoPending}
            />
            <SimpleField
              form={form}
              name="phone"
              label="شماره تماس"
              description="با 09 شروع میشود"
              type="number"
              defaultValue="09123456789"
              disabled={teacherInfoPending}
            />
          </div>
          <SimpleField
            form={form}
            name="address"
            label="آدرس"
            type="textarea"
            defaultValue="ادرس خود را وارد کنید ..."
            disabled={teacherInfoPending}
          />
          <div className="flex flex-row gap-4">
            <RadioGroupField fieldName="sex" form={form} labelName="جنسیت">
              <RadioGroupField.Option label="مرد" value="MALE" />
              <RadioGroupField.Option label="زن" value="FEMALE" />
            </RadioGroupField>
          </div>
          <SubjectSelectField
            form={form}
            fieldName="subject"
            subjectValue={subjectValue}
            setSubjectValue={setSubjectValue}
            formLable="حوزه تدریس معلم"
            description="تخصص معلم در تدریس کدام درس است ؟"
            row={row}
            rowKey="subject"
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
export default EditTeacherForm;
