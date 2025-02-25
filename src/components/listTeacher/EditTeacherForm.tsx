"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageIcon, Loader2Icon } from "lucide-react";
import {
  TeacherDataListSchema,
  TeacherEditFormSchemas,
} from "@/lib/schemas";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {EditTeacherData, getTeacherInfo } from "@/actions/teacherAction";
import { toast } from "sonner";

type Row<T> = {
  original: T;
};

interface EditTeacherFormProps {
  onCancel: () => void;
  row: Row<TeacherDataListSchema>;
}

const EditTeacherForm = ({ onCancel, row }: EditTeacherFormProps) => {
  const { data: teacherInfo, isPending: teacherInfoPending } = useQuery({
    queryKey: ["teacherInfo", row.original.id],
    queryFn: async () => getTeacherInfo(row.original.id),
  });
  const inputRef = useRef<HTMLInputElement>(null);
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>نام</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-orange-300 "
                      disabled={teacherInfoPending}
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>نام خانوادگی</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-orange-300"
                      disabled={teacherInfoPending}
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>نام کاربری</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-orange-300"
                      disabled={teacherInfoPending}
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>شماره تماس</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-orange-300"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>با 09 شروع میشود</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>ادرس</FormLabel>
                <FormControl>
                  <Textarea
                    className="focus-visible:ring-orange-300"
                    placeholder="ادرس خود را وارد کنید ..."
                    disabled={teacherInfoPending}
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>جنسیت</FormLabel>
                  <FormControl>
                    <RadioGroup
                      dir="rtl"
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row gap-2 h-9 justify-around"
                      disabled={teacherInfoPending}
                    >
                      <FormItem className="flex items-center">
                        <FormControl>
                          <RadioGroupItem value="MALE" />
                        </FormControl>
                        <FormLabel className="m-2">مرد</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center">
                        <FormControl>
                          <RadioGroupItem value="FEMALE" />
                        </FormControl>
                        <FormLabel className="m-2">زن</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
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
            <Button
              className="w-full bg-orange-400 hover:bg-orange-300"
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <>
                  <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                  لطفا صبر کنید ...
                </>
              ) : (
                "ثبت"
              )}
            </Button>
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
