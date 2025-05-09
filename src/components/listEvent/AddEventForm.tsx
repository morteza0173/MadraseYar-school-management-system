"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { eventFormSchemas } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { Calendar } from "../ui/calendar";
import { AddEventData } from "@/actions/eventAction";
import ClassSelectField from "../tableComponent/ReusableField/ClassSelectField";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";

const AddEventForm = ({ onCancel }: { onCancel: () => void }) => {
  const [classValue, setClassValue] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => AddEventData(data),
    onSuccess: (data) => {
      toast.success(data.message || "رویداد با موفقیت اضافه شد");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در اضافه کردن رویداد");
    },
  });

  const form = useForm<z.infer<typeof eventFormSchemas>>({
    resolver: zodResolver(eventFormSchemas),
    defaultValues: {
      title: "",
      description: "",
      className: "",
      startTime: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof eventFormSchemas>) => {
    console.log(data);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("startTime", data.startTime);
    formData.append("className", data.className || "");

    mutate(formData);
  };

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-row gap-4 ">
            <SimpleField
              form={form}
              name="title"
              label="عنوان"
              description="حداکثر 20 حرف"
            />
          </div>
          <SimpleField
            form={form}
            name="description"
            label="توضیحات"
            type="textarea"
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
export default AddEventForm;
