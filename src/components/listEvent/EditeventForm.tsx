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
import { Loader2Icon } from "lucide-react";
import { eventEditFormSchemas } from "@/lib/schemas";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { EditEventData } from "@/actions/eventAction";
import ClassSelectField from "../tableComponent/ReusableField/ClassSelectField";

type Row<T> = {
  original: T;
};

type announcementProps = {
  id: number;
  title: string;
  description: string;
  className: string;
  startTime: Date;
};

interface EditStudentFormProps {
  onCancel: () => void;
  row: Row<announcementProps>;
}

const EditeventForm = ({ onCancel, row }: EditStudentFormProps) => {
  const [classValue, setClassValue] = useState<string | undefined>(
    row.original.className
  );
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => EditEventData(data),
    onSuccess: (data) => {
      toast.success(data.message || "رویداد با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["events"] });

      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در ویرایش کردن رویداد");
    },
  });

  const form = useForm<z.infer<typeof eventEditFormSchemas>>({
    resolver: zodResolver(eventEditFormSchemas),
    defaultValues: {
      title: row.original.title,
      description: row.original.description,
      className: row.original.className,
      startTime: row.original.startTime,
    },
  });

  const onSubmit = async (data: z.infer<typeof eventEditFormSchemas>) => {
    const formData = new FormData();
    formData.append("id", row.original.id.toString());
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("startTime", data.startTime.toString());
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
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>تاریخ رویداد</FormLabel>
                <FormControl>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <Input
                        readOnly
                        value={
                          field.value
                            ? new Date(field.value).toLocaleDateString(
                                "fa-IR",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  timeZone: "Asia/Tehran",
                                }
                              )
                            : "تاریخ را انتخاب کنید"
                        }
                        placeholder="تاریخ را انتخاب کنید"
                        className="cursor-pointer"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        disabled={{ before: new Date() }}
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          field.onChange(date?.toISOString()); // ذخیره تاریخ در فرم
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <ClassSelectField
            form={form}
            classValue={classValue}
            setClassValue={setClassValue}
            fieldName="className"
            hasClearButton
            description="اگر کلاسی انتخاب نکنید به عنوان رویداد عمومی برای همه ارسال میشود"
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
export default EditeventForm;
