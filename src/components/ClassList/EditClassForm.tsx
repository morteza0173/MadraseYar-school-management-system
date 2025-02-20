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
  ChevronsUpDown,
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
import { EditClass } from "@/actions/classAction";
import { AddClassFormSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetTeacher from "@/hooks/useGetTeacher";
import useGetGradeData from "@/hooks/useGetGradeData";

interface RowData {
  name: string;
  grade: number;
  capacity: number;
  studentCount: number;
  supervisor?: string;
}

type Row<T> = {
  original: T;
};

interface EditeClassFormProps {
  teacherList?: teacherListProps[] | null;
  gradeList?: gradeListProps[] | null;
  onCancel: () => void;
  row: Row<RowData>;
}

const EditClassForm = ({ onCancel, row }: EditeClassFormProps) => {

  const [openTeacherList, setOpenTeacherList] = useState(false);
  const [supervisorValue, setSupervisorValue] = useState("");
  const [searchTeacher, setSearchTeacher] = useState("");

  const [openGradeList, setOpenGradeList] = useState(false);
  const [gradeValue, setGradeValue] = useState("");

  const queryClient = useQueryClient();
  const {mutate,isPending} = useMutation({
    mutationFn: async (data: FormData) => EditClass(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["classDetails"] });
      toast.success(data.message || "کلاس با موفقیت ویرایش شد");
      onCancel();
    },
    onError: (data) => {
      toast.error(data.message || "مشکلی در ویرایش کلاس به وجود آمد");
    },
  });

  const { teacherData, isTeacherError, isTeacherPending, teacherRefetch } =
    useGetTeacher();

  const { gradeData, gradeRefetch, isGradeError, isGradePending } =
    useGetGradeData();

  const filteredTeacherList = teacherData?.filter((teacher) => {
    if (!searchTeacher) return true;

    const fullName = `${teacher.name} ${teacher.surname}`.toLowerCase();
    return fullName.includes(searchTeacher.toLowerCase());
  });

  useEffect(() => {
    if (!isTeacherPending && !isTeacherError) {
      const fullName = row.original.supervisor;
      const teacher = teacherData?.find(
        (t) => `${t.name} ${t.surname}` === fullName
      );
      console.log(teacher);
      if (teacher) {
        setSupervisorValue(teacher.id);
      }
    }
  }, [isTeacherPending, row.original.supervisor, isTeacherError, teacherData]);

  useEffect(() => {
    if (!isGradePending && !isGradeError) {
      const grade = gradeData?.find((g) => g.level === row.original.grade);
      if (grade) {
        setGradeValue(grade.id.toString());
      }
    }
  }, [isGradePending, row.original.grade, isGradeError, gradeData]);

  const form = useForm<z.infer<typeof AddClassFormSchema>>({
    resolver: zodResolver(AddClassFormSchema),
    defaultValues: {
      className: row.original.name,
      capacity: row.original.capacity.toString(),
      supervisorId: row.original.supervisor,
      grade: row.original.grade.toString(),
    },
  });

  const onSubmit = async (data: z.infer<typeof AddClassFormSchema>) => {

    const formData = new FormData();
    formData.set("classId", row.original.name);
    formData.set("className", data.className);
    formData.set("capacity", data.capacity);
    formData.set("supervisor", supervisorValue);
    formData.set("grade", gradeValue);
    mutate(formData);
  };
  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="className"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام کلاس</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-orange-300"
                    placeholder="10B"
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
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ظرفیت کلاس</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-orange-300"
                    type="number"
                    placeholder="0"
                    {...field}
                  />
                </FormControl>
                <FormDescription>حداقل باید 1 نفر باشد</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supervisorId"
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
                            {supervisorValue
                              ? `${
                                  teacherData?.find(
                                    (teacher) => teacher.id === supervisorValue
                                  )?.name
                                } ${
                                  teacherData?.find(
                                    (teacher) => teacher.id === supervisorValue
                                  )?.surname
                                }`
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
                                    className="z-[60] pointer-events-auto"
                                    value={String(teacher.id)}
                                    onSelect={(currentValue) => {
                                      const selectedValue =
                                        currentValue === String(supervisorValue)
                                          ? ""
                                          : currentValue;
                                      setSupervisorValue(selectedValue);
                                      field.onChange(selectedValue);
                                      setOpenTeacherList(false);
                                    }}
                                  >
                                    {`${teacher.name} ${teacher.surname}`}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        supervisorValue === teacher.id
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
            name="grade"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>انتخاب سال تحصیلی </FormLabel>
                  <FormControl>
                    <>
                      <Popover
                        modal
                        open={openGradeList}
                        onOpenChange={setOpenGradeList}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openGradeList}
                            className="w-[250px] justify-between "
                          >
                            {gradeValue
                              ? gradeData?.find(
                                  (grade) => grade.id === Number(gradeValue)
                                )?.level
                              : "سال تحصیلی را از لیست انتخاب کنید"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0 ">
                          <Command>
                            <CommandList>
                              <CommandEmpty>
                                <div className="flex items-center justify-center h-full w-full">
                                  {isGradePending ? (
                                    <div className="flex gap-2 items-center">
                                      <Loader2 className="size-4 animate-spin" />
                                      <p>در حال دریافت اطلاعات</p>
                                    </div>
                                  ) : isGradeError ? (
                                    <div className="flex flex-col gap-4 items-center">
                                      <div className="flex gap-2">
                                        <TriangleAlert className="size-4" />
                                        <p className="text-xs font-semibold">
                                          اینترنت خود را ببرسی کنید
                                        </p>
                                      </div>
                                      <Button
                                        variant="outline"
                                        onClick={() => gradeRefetch()}
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
                                {gradeData?.map((grade) => (
                                  <CommandItem
                                    key={grade.id}
                                    className="z-[60] pointer-events-auto overflow-auto"
                                    value={String(grade.id)}
                                    onSelect={(currentValue) => {
                                      const selectedValue =
                                        currentValue === String(gradeValue)
                                          ? ""
                                          : currentValue;
                                      setGradeValue(selectedValue);
                                      field.onChange(selectedValue);
                                      setOpenGradeList(false);
                                    }}
                                  >
                                    {grade.level}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        Number(gradeValue) === grade.id
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
              disabled={isPending || isTeacherPending || isGradePending}
              type="submit"
            >
              {isPending ? (
                <>
                  <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                  لطفا صبر کنید ...
                </>
              ) : (
                "ویرایش"
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
export default EditClassForm;
