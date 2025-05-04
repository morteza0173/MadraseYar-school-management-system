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
import {
  Check,
  ChevronsUpDown,
  Loader2,
  Loader2Icon,
  TriangleAlert,
} from "lucide-react";
import { announcementFormSchemas } from "@/lib/schemas";
import { Textarea } from "../ui/textarea";

import { useState } from "react";
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
import { useUserAuth } from "@/hooks/useUserAuth";
import { cn } from "@/lib/utils";
import { EditAnnouncementData } from "@/actions/announcementAction";
import { useGetClassDetails } from "@/hooks/useGetClassDetails";

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
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const {
    data: ClassData,
    refetch: classRefetch,
    isError: isClassError,
    isPending: isClassPending,
  } = useGetClassDetails(userData);

  const [openClassList, setOpenClassList] = useState(false);
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>عنوان</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-orange-300 "
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>حداکثر 20 حرف</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>توضیحات</FormLabel>
                <FormControl>
                  <Textarea
                    className="focus-visible:ring-orange-300"
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
            name="className"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>انتخاب کلاس</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Popover
                        modal
                        open={openClassList}
                        onOpenChange={setOpenClassList}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openClassList}
                            className="w-[250px] justify-between "
                          >
                            {classValue
                              ? ClassData?.find(
                                  (Class) => Class.name === classValue
                                )?.name
                              : "کلاس را از لیست انتخاب کنید"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0 ">
                          <Command>
                            <CommandList>
                              <CommandEmpty>
                                <div className="flex items-center justify-center h-full w-full">
                                  {isClassPending ? (
                                    <div className="flex gap-2 items-center">
                                      <Loader2 className="size-4 animate-spin" />
                                      <p>در حال دریافت اطلاعات</p>
                                    </div>
                                  ) : isClassError ? (
                                    <div className="flex flex-col gap-4 items-center">
                                      <div className="flex gap-2">
                                        <TriangleAlert className="size-4" />
                                        <p className="text-xs font-semibold">
                                          اینترنت خود را ببرسی کنید
                                        </p>
                                      </div>
                                      <Button
                                        variant="outline"
                                        onClick={() => classRefetch()}
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
                                {ClassData?.map((Class) => (
                                  <CommandItem
                                    key={Class.name}
                                    className="z-[60] pointer-events-auto overflow-auto"
                                    value={String(Class.name)}
                                    onSelect={(currentValue) => {
                                      const selectedValue =
                                        currentValue === String(classValue)
                                          ? ""
                                          : currentValue;
                                      setClassValue(selectedValue);
                                      field.onChange(selectedValue);
                                      setOpenClassList(false);
                                    }}
                                  >
                                    {Class.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        classValue === Class.name
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
                      <Button
                        variant="outline"
                        type="button"
                        size="icon"
                        onClick={() => {
                          setClassValue("");
                          form.setValue("className", "");
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  </FormControl>
                </div>
                <FormDescription>کلاس را انتخاب کنید</FormDescription>
                <FormMessage />
              </FormItem>
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
export default EditAnnouncementForm;
