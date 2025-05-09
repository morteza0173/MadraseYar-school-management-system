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
import { StudentDataListSchema, StudentEditFormSchemas } from "@/lib/schemas";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { EditStudentData, getStudentInfo } from "@/actions/studentAction";
import { useGetParentData } from "@/hooks/useGetParentData";
import ClassSelectField from "../tableComponent/ReusableField/ClassSelectField";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";
import { Avatar, AvatarFallback } from "../ui/avatar";

type Row<T> = {
  original: T;
};

interface EditStudentFormProps {
  onCancel: () => void;
  row: Row<StudentDataListSchema>;
}

const EditStudentForm = ({ onCancel, row }: EditStudentFormProps) => {
  const {
    isError: isParentError,
    isPending: isParentPending,
    data: parentData,
    refetch: parentRefetch,
  } = useGetParentData();
  const {
    data: studentInfo,
    isPending: studentInfoPending,
    isError: studentInfoError,
  } = useQuery({
    queryKey: ["studentInfo", row.original.id],
    queryFn: async () => getStudentInfo(row.original.id),
  });

  const [openParentList, setOpenParentList] = useState(false);
  const [parentValue, setParentValue] = useState<
    { id: string; name: string; surname: string } | undefined
  >({
    id: row.original.parent.id,
    name: studentInfo?.parent?.name || "در حال دریافت ",
    surname: studentInfo?.parent?.surname || "",
  });

  const [classValue, setClassValue] = useState<string | undefined>(
    row.original.class.name
  );

  const inputRef = useRef<HTMLInputElement>(null);
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
      parent: row.original.parent.id,
      classValue: row.original.class.name,
    },
  });

  useEffect(() => {
    if (!studentInfoPending && !studentInfoError) {
      if (studentInfo.parent?.id) {
        setParentValue({
          id: row.original.parent.id,
          name: studentInfo.parent?.name,
          surname: studentInfo.parent?.surname,
        });
      }
    }
  }, [studentInfo, studentInfoPending, row.original.id, studentInfoError]);

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
                      disabled={studentInfoPending}
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
export default EditStudentForm;
