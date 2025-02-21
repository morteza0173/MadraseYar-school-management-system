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
import { gradeListProps } from "@/actions/gradeActions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Loader2,
  Loader2Icon,
  Search,
  TriangleAlert,
} from "lucide-react";
import { teacherListProps } from "@/actions/dashboardAction";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { AddLessonFormSchema, LessonsListSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetTeacher from "@/hooks/useGetTeacher";
import { Day, Prisma } from "@prisma/client";
import { useUserAuth } from "@/hooks/useUserAuth";
import useGetSubjects from "@/hooks/useGetSubjects";
import useGetClassDetails from "@/hooks/useGetClassDetails";
import { EditLesson } from "@/actions/lessonsAction";

const days = [
  { label: "شنبه", value: "SATURDAY" },
  { label: "یکشنبه", value: "SUNDAY" },
  { label: "دوشنبه", value: "MONDAY" },
  { label: "سه‌شنبه", value: "TUESDAY" },
  { label: "چهارشنبه", value: "WEDNESDAY" },
];

type Row<T> = {
  original: T;
};

interface EditLessonFormProps {
  teacherList?: teacherListProps[] | null;
  gradeList?: gradeListProps[] | null;
  onCancel: () => void;
  row: Row<LessonsListSchema>;
}

const EditLessonsForm = ({ onCancel, row }: EditLessonFormProps) => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const { teacherData, isTeacherError, isTeacherPending, teacherRefetch } =
    useGetTeacher();
  const { isSubjectError, isSubjectPending, subjectData, subjectRefetch } =
    useGetSubjects(userData);
  const { ClassData, classRefetch, isClassError, isClassPending } =
    useGetClassDetails(userData);

  const [openTeacherList, setOpenTeacherList] = useState(false);
  const [teacherValue, setTeacherValue] = useState("");
  const [subjectValue, setSubjectValue] = useState("");
  const [classValue, setClassValue] = useState("");

  const [searchTeacher, setSearchTeacher] = useState("");

  const [openDayList, setOpenDayList] = useState(false);
  const [openClassList, setOpenClassList] = useState(false);

  const [openSubjectList, setOpenSubjectList] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      data,
      id,
    }: {
      data: Prisma.LessonUpdateInput;
      id: number;
    }) => EditLesson({ data, id }),
    onSuccess: (data) => {
      toast.success(data.message || "با موفقیت افزوده شد");
      onCancel();
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: (data) => {
      toast.error(data.message || "خطا");
    },
  });

  const startTime = row.original.startTime;
  const [startHour, startMinute] = startTime.split(":");
  const endTime = row.original.endTime;
  const [endHour, endMinute] = endTime.split(":");

  const form = useForm<z.infer<typeof AddLessonFormSchema>>({
    resolver: zodResolver(AddLessonFormSchema),
    defaultValues: {
      lessonName: row.original.lessonName,
      className: row.original.className,
      subjectName: row.original.subjectName,
      teacher: row.original.teacher.id,
      day: row.original.day,
      startHour: Number(startHour),
      startMinute: Number(startMinute),
      endHour: Number(endHour),
      endMinute: Number(endMinute),
    },
  });

  useEffect(() => {
    if (!isTeacherPending && !isTeacherError) {
      const teacherId = row.original.teacher.id;
      const teacher = teacherData?.find((t) => t.id === teacherId);
      if (teacher) {
        setTeacherValue(teacher.id);
      }
    }
  }, [isTeacherError, isTeacherPending, row.original.teacher.id, teacherData]);
  useEffect(() => {
    if (!isSubjectError && !isSubjectPending) {
      const subjectName = row.original.subjectName;
      const subject = subjectData?.find((s) => s.name === subjectName);
      if (subject) {
        setSubjectValue(subject.name);
      }
    }
  }, [isSubjectError, isSubjectPending, row.original.subjectName, subjectData]);
  useEffect(() => {
    if (!isClassError && !isClassPending) {
      const className = row.original.className;
      const classRow = ClassData?.find((c) => c.name === className);
      if (classRow) {
        setClassValue(classRow.name);
      }
    }
  }, [isClassError, isClassPending, row.original.className, ClassData]);
  useEffect(() => {
    const selectedDay = row.original.day;
    const day = days?.find((day) => day.label === selectedDay);
    if (day) {
      form.setValue("day", day.value);
    }
  }, [row.original.day, form]);

  const filteredTeacherList = teacherData?.filter((teacher) => {
    if (!searchTeacher) return true;

    const fullName = `${teacher.name} ${teacher.surname}`.toLowerCase();
    return fullName.includes(searchTeacher.toLowerCase());
  });

  const selectedTeacher = teacherData?.find(
    (teacher) => teacher.id === teacherValue
  );

  const selectedDay = form.watch("day");


  const adjustTime = (
    field: "startHour" | "startMinute" | "endHour" | "endMinute",
    amount: number
  ) => {
    const currentVal = form.getValues(field) as number;
    const max = field.includes("Hour") ? 23 : 59;
    const newVal = Math.min(Math.max(currentVal + amount, 0), max);
    form.setValue(field, newVal);
  };

  const onSubmit = async (data: z.infer<typeof AddLessonFormSchema>) => {
    const now = new Date();
    const startTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      data.startHour,
      data.startMinute
    );

    const endTime = new Date(
      now.getFullYear() + 1,
      now.getMonth(),
      now.getDate(),
      data.endHour,
      data.endMinute
    );

    const lessonData: Prisma.LessonUpdateInput = {
      name: data.lessonName,
      day: data.day as Day,
      startTime: startTime,
      endTime: endTime,
      class: {
        connect: { name: data.className },
      },
      subject: {
        connect: { name: data.subjectName },
      },
      teacher: {
        connect: { id: data.teacher },
      },
    };

    mutate({ data: lessonData, id: row.original.lessonId });
  };
  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="lessonName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام درس</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-orange-300"
                    placeholder="ریاضی سال اول"
                    {...field}
                  />
                </FormControl>
                <FormDescription>حداکثر 20 حرف</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subjectName"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>انتخاب حوزه تدریس</FormLabel>
                  <FormControl>
                    <>
                      <Popover
                        modal
                        open={openSubjectList}
                        onOpenChange={setOpenSubjectList}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSubjectList}
                            className="w-[250px] justify-between "
                          >
                            {subjectValue
                              ? subjectData?.find(
                                  (subject) => subject.name === subjectValue
                                )?.name
                              : "حوزه تدریس را از لیست انتخاب کنید"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0 ">
                          <Command>
                            <CommandList>
                              <CommandEmpty>
                                <div className="flex items-center justify-center h-full w-full">
                                  {isSubjectPending ? (
                                    <div className="flex gap-2 items-center">
                                      <Loader2 className="size-4 animate-spin" />
                                      <p>در حال دریافت اطلاعات</p>
                                    </div>
                                  ) : isSubjectError ? (
                                    <div className="flex flex-col gap-4 items-center">
                                      <div className="flex gap-2">
                                        <TriangleAlert className="size-4" />
                                        <p className="text-xs font-semibold">
                                          اینترنت خود را بررسی کنید
                                        </p>
                                      </div>
                                      <Button
                                        variant="outline"
                                        onClick={() => subjectRefetch()}
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
                                {subjectData?.map((subject) => (
                                  <CommandItem
                                    key={subject.name}
                                    className="z-[60] pointer-events-auto overflow-auto"
                                    value={String(subject.name)}
                                    onSelect={(currentValue) => {
                                      const selectedValue =
                                        currentValue === String(subjectValue)
                                          ? ""
                                          : currentValue;
                                      setSubjectValue(selectedValue);
                                      field.onChange(selectedValue);
                                      setOpenSubjectList(false);
                                    }}
                                  >
                                    {subject.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        subjectValue === subject.name
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
                <FormDescription>حوزه تدریس را انتخاب کنید</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>انتخاب روز هفته</FormLabel>
                  <FormControl>
                    <>
                      <Popover
                        open={openDayList}
                        onOpenChange={setOpenDayList}
                        modal
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openDayList}
                            className="w-[250px] justify-between "
                          >
                            {selectedDay
                              ? days.find((day) => day.value === selectedDay)
                                  ?.label
                              : "یک روز هفته انتخاب کنید"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0">
                          <Command>
                            <CommandList>
                              <CommandEmpty>نتیجه‌ای یافت نشد</CommandEmpty>
                              <CommandGroup>
                                {days.map((day) => (
                                  <CommandItem
                                    key={day.value}
                                    className="z-[60]"
                                    value={day.value}
                                    onSelect={(currentValue) => {
                                      form.setValue("day", currentValue);
                                      field.onChange(currentValue);
                                      setOpenDayList(false);
                                    }}
                                  >
                                    {day.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        selectedDay === day.value
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
                <FormDescription>باید یک روز را انتخاب کنید</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <FormField
              control={form.control}
              name="startHour"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2 items-center justify-between">
                      <FormLabel>زمان شروع کلاس</FormLabel>
                      <div className="flex md:gap-2 justify-center  items-center">
                        {/* دقیقه شروع */}
                        <div className="flex flex-col items-center justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => adjustTime("startMinute", 5)}
                          >
                            <ChevronUp />
                          </Button>
                          <Input
                            value={form.watch("startMinute")}
                            className="w-10 md:w-12 text-center"
                            readOnly
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => adjustTime("startMinute", -5)}
                          >
                            <ChevronDown />
                          </Button>
                        </div>
                        {/* ساعت شروع */}
                        <div className="flex flex-col items-center justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => adjustTime("startHour", 1)}
                          >
                            <ChevronUp />
                          </Button>
                          <Input
                            value={field.value}
                            className="w-10 md:w-12 text-center"
                            readOnly
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => adjustTime("startHour", -1)}
                          >
                            <ChevronDown />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endHour"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2 items-center justify-between">
                      <FormLabel>زمان پایان کلاس</FormLabel>
                      <div className="flex md:gap-2 justify-center  items-center">
                        {/* دقیقه پایان */}
                        <div className="flex flex-col items-center justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => adjustTime("endMinute", 5)}
                          >
                            <ChevronUp />
                          </Button>
                          <Input
                            value={form.watch("endMinute")}
                            className="w-10 md:w-12 text-center"
                            readOnly
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => adjustTime("endMinute", -5)}
                          >
                            <ChevronDown />
                          </Button>
                        </div>
                        {/* ساعت پایان */}
                        <div className="flex flex-col items-center justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => adjustTime("endHour", 1)}
                          >
                            <ChevronUp />
                          </Button>
                          <Input
                            value={field.value}
                            className="w-10 md:w-12 text-center"
                            readOnly
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => adjustTime("endHour", -1)}
                          >
                            <ChevronDown />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="teacher"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>انتخاب معلم </FormLabel>
                  <FormControl>
                    <>
                      <Popover
                        open={openTeacherList}
                        onOpenChange={setOpenTeacherList}
                        modal
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openTeacherList}
                            className="w-[250px] justify-between "
                          >
                            {teacherValue
                              ? `${selectedTeacher?.name} ${selectedTeacher?.surname}`
                              : "یک معلم از لیست انتخاب کنید"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0">
                          <Command>
                            {!isTeacherPending && !isTeacherError && (
                              <div
                                className="hidden md:flex items-center border-b px-3 w-full"
                                cmdk-input-wrapper=""
                              >
                                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                <input
                                  placeholder="نام معلم را جستجو کنید"
                                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                  value={searchTeacher}
                                  tabIndex={-1}
                                  onChange={(e) =>
                                    setSearchTeacher(e.target.value)
                                  }
                                />
                              </div>
                            )}
                            <CommandList>
                              <CommandEmpty>
                                <div className="flex items-center justify-center h-full w-full">
                                  {isTeacherPending ? (
                                    <div className="flex gap-2 items-center">
                                      <Loader2 className="size-4 animate-spin" />
                                      <p>در حال دریافت اطلاعات</p>
                                    </div>
                                  ) : isTeacherError ? (
                                    <div className="flex flex-col gap-4 items-center">
                                      <div className="flex gap-2">
                                        <TriangleAlert className="size-4" />
                                        <p className="text-xs font-semibold">
                                          اینترنت خود را ببرسی کنید
                                        </p>
                                      </div>
                                      <Button
                                        variant="outline"
                                        onClick={() => teacherRefetch()}
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
                                {filteredTeacherList?.map((teacher) => (
                                  <CommandItem
                                    key={teacher.id}
                                    className="z-[60]"
                                    value={String(teacher.id)}
                                    onSelect={(currentValue) => {
                                      const selectedValue =
                                        currentValue === String(teacherValue)
                                          ? ""
                                          : currentValue;
                                      setTeacherValue(selectedValue);
                                      field.onChange(selectedValue);
                                      setOpenTeacherList(false);
                                    }}
                                  >
                                    {`${teacher.name} ${teacher.surname}`}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        teacherValue === teacher.id
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
                <FormDescription>حداقل باید 1 نفر باشد</FormDescription>
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
                    <>
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
                    </>
                  </FormControl>
                </div>
                <FormDescription>سال تحصیلی انتخاب کنید</FormDescription>
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
export default EditLessonsForm;
