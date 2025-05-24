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
import {
  Check,
  ChevronsUpDown,
  ImageIcon,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { StudentFormSchemas } from "@/lib/schemas";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { AddStudentData } from "@/actions/studentAction";
import { useGetParentData } from "@/hooks/useGetParentData";
import ClassSelectField from "../tableComponent/ReusableField/ClassSelectField";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";
import RadioGroupField from "../tableComponent/ReusableField/RadioGroupField";

const AddStudentForm = ({ onCancel }: { onCancel: () => void }) => {
  const {
    isError: isParentError,
    isPending: isParentPending,
    data: parentData,
    refetch: parentRefetch,
  } = useGetParentData();

  const [openParentList, setOpenParentList] = useState(false);
  const [parentValue, setParentValue] = useState<
    { id: string; name: string; surname: string } | undefined
  >(undefined);
  const [classValue, setClassValue] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => AddStudentData(data),
    onSuccess: (data) => {
      toast.success(data.message || "دانش‌آموز با موفقیت اضافه شد");
      queryClient.invalidateQueries({ queryKey: ["studentData"] });
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در اضافه کردن دانش‌آموز");
    },
  });

  const form = useForm<z.infer<typeof StudentFormSchemas>>({
    resolver: zodResolver(StudentFormSchemas),
    defaultValues: {
      name: "",
      surname: "",
      username: "",
      phone: "",
      password: "",
      address: "",
      image: undefined,
      parent: "",
      classValue: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof StudentFormSchemas>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("surname", data.surname);
    formData.append("username", data.username);
    formData.append("phone", data.phone ? data.phone : "");
    formData.append("password", data.password);
    formData.append("address", data.address);
    formData.append("image", data.image);
    formData.append("email", data.email);
    formData.append("sex", data.sex);
    formData.append("parent", data.parent);
    formData.append("classValue", data.classValue);

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
            <SimpleField form={form} name="password" label="رمز عبور" />
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
              type="number"
              defaultValue="09123456789"
              description="با 09 شروع میشودد"
            />
          </div>
          <ClassSelectField
            form={form}
            fieldName="classValue"
            classValue={classValue}
            setClassValue={setClassValue}
          />
          <FormField
            control={form.control}
            name="parent"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>انتخاب والد</FormLabel>
                  <FormControl>
                    <>
                      <Popover
                        modal
                        open={openParentList}
                        onOpenChange={setOpenParentList}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openParentList}
                            className="w-[250px] justify-between "
                          >
                            {parentValue
                              ? `${parentValue.name} ${parentValue.surname}`
                              : "والد را از لیست انتخاب کنید"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0 ">
                          <Command>
                            <CommandList>
                              <CommandEmpty>
                                <div className="flex items-center justify-center h-full w-full">
                                  {isParentPending ? (
                                    <div className="flex gap-2 items-center">
                                      <Loader2 className="size-4 animate-spin" />
                                      <p>در حال دریافت اطلاعات</p>
                                    </div>
                                  ) : isParentError ? (
                                    <div className="flex flex-col gap-4 items-center">
                                      <div className="flex gap-2">
                                        <TriangleAlert className="size-4" />
                                        <p className="text-xs font-semibold">
                                          اینترنت خود را ببرسی کنید
                                        </p>
                                      </div>
                                      <Button
                                        variant="outline"
                                        onClick={() => parentRefetch()}
                                      >
                                        تلاش مجدد
                                      </Button>
                                    </div>
                                  ) : (
                                    "نتیجه‌ای یافت نشد"
                                  )}
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {parentData?.map((parent) => (
                                  <CommandItem
                                    key={parent.id}
                                    className="z-[60] pointer-events-auto overflow-auto"
                                    value={String(parent.id)}
                                    onSelect={(currentValue) => {
                                      const selectedParent = parentData.find(
                                        (parent) => parent.id === currentValue
                                      );
                                      const selectedValue = selectedParent
                                        ? {
                                            id: selectedParent.id,
                                            name: selectedParent.name,
                                            surname: selectedParent.surname,
                                          }
                                        : undefined;
                                      setParentValue(selectedValue);
                                      field.onChange(selectedValue?.id);
                                      setOpenParentList(false);
                                    }}
                                  >
                                    {parent.name} {parent.surname}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        parentValue?.id === parent.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </>
                  </FormControl>
                </div>
                <FormDescription>والد را انتخاب کنید</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    <p>عکس دانش‌آموز</p>
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
export default AddStudentForm;
