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
import {
  Check,
  ChevronsUpDown,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { examFormSchemas } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserAuth } from "@/hooks/useUserAuth";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Calendar } from "../ui/calendar";
import { AddExamData } from "@/actions/examAction";
import { useGetClassDetails } from "@/hooks/useGetClassDetails";
import { useGetLessonsData } from "@/hooks/useGetLessonsData";
import SimpleField from "../tableComponent/ReusableField/SimpleField";
import SubmitButton from "../SubmitButton";

const AddExamForm = ({ onCancel }: { onCancel: () => void }) => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const {
    data: lessonsData,
    isPending: isLessonsPending,
    isError: isLessonsError,
    refetch: lessonsRefetch,
  } = useGetLessonsData(userData);

  const { data: ClassData } = useGetClassDetails(userData);

  const [openLessonList, setOpenLessonList] = useState(false);
  const [lessonValue, setLessonValue] = useState<number | undefined>(undefined);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => AddExamData(data),
    onSuccess: (data) => {
      toast.success(data.message || "امتحان با موفقیت اضافه شد");
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در اضافه کردن امتحان");
    },
  });

  const form = useForm<z.infer<typeof examFormSchemas>>({
    resolver: zodResolver(examFormSchemas),
    defaultValues: {
      title: "",
      lessonId: "",
      startTime: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof examFormSchemas>) => {
    console.log(data);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("startTime", data.startTime);
    formData.append("lessonId", data.lessonId);

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
          <FormField
            control={form.control}
            name="lessonId"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>انتخاب درس</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Popover
                        modal
                        open={openLessonList}
                        onOpenChange={setOpenLessonList}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openLessonList}
                            className="w-[250px] justify-between "
                          >
                            {lessonValue
                              ? (() => {
                                  const selectedLesson = lessonsData?.find(
                                    (lesson) => lesson.lessonId === lessonValue
                                  );
                                  const className = ClassData?.find(
                                    (classItem) =>
                                      classItem.name ===
                                      selectedLesson?.className
                                  )?.name;

                                  return selectedLesson
                                    ? `${selectedLesson.lessonName} ${
                                        className ? `(${className})` : ""
                                      }`
                                    : "درس انتخاب‌شده نامشخص است";
                                })()
                              : "درس را از لیست انتخاب کنید"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0 ">
                          <Command>
                            <CommandList>
                              <CommandEmpty>
                                <div className="flex items-center justify-center h-full w-full">
                                  {isLessonsPending ? (
                                    <div className="flex gap-2 items-center">
                                      <Loader2 className="size-4 animate-spin" />
                                      <p>در حال دریافت اطلاعات</p>
                                    </div>
                                  ) : isLessonsError ? (
                                    <div className="flex flex-col gap-4 items-center">
                                      <div className="flex gap-2">
                                        <TriangleAlert className="size-4" />
                                        <p className="text-xs font-semibold">
                                          اینترنت خود را ببرسی کنید
                                        </p>
                                      </div>
                                      <Button
                                        variant="outline"
                                        onClick={() => lessonsRefetch()}
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
                                {lessonsData?.map((lesson) => (
                                  <CommandItem
                                    key={lesson.lessonName}
                                    className="z-[60] pointer-events-auto overflow-auto"
                                    value={String(lesson.lessonId)}
                                    onSelect={(currentValue) => {
                                      const selectedValue =
                                        currentValue === String(lessonValue)
                                          ? ""
                                          : currentValue;
                                      setLessonValue(Number(selectedValue));
                                      field.onChange(selectedValue);
                                      setOpenLessonList(false);
                                    }}
                                  >
                                    {(() => {
                                      const className = ClassData?.find(
                                        (classItem) =>
                                          classItem.name === lesson.className
                                      )?.name;

                                      return `${lesson.lessonName} ${
                                        className ? `(${className})` : ""
                                      }`;
                                    })()}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        lessonValue === lesson.lessonId
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
                    </div>
                  </FormControl>
                </div>
                {/* <FormDescription>

                </FormDescription> */}
                <FormMessage />
              </FormItem>
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
export default AddExamForm;
