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
import { useFormState } from "react-dom";
import { GetGradeData, gradeListProps } from "@/actions/gradeActions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Loader2Icon, Search } from "lucide-react";
import { getTeacher, teacherListProps } from "@/actions/dashboardAction";
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
import { Grade, Teacher } from "@prisma/client";

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
  const [state, formAction] = useFormState(EditClass, { message: "" });
  const [pending, setPending] = useState(false);

  const [openTeacherList, setOpenTeacherList] = useState(false);
  const [supervisorValue, setSupervisorValue] = useState("");
  const [searchTeacher, setSearchTeacher] = useState("");

  const [openGradeList, setOpenGradeList] = useState(false);
  const [gradeValue, setGradeValue] = useState("");

  const [pendingTeacher, setPendingTeacher] = useState(false);
  const [pendingGrade, setPendingGrade] = useState(false);
  const [errorTeacher, setErrorTeacher] = useState(false);
  const [errorGrade, setErrorGrade] = useState(false);
  const [isFetchedTeacher, setIsFetchedTeacher] = useState(false);
  const [isFetchedGrade, setIsFetchedGrade] = useState(false);

  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const [gradeList, setGradeList] = useState<Grade[]>([]);

  const filteredTeacherList = teacherList?.filter((teacher) =>
    teacher.name?.toLowerCase().includes(searchTeacher?.toLowerCase())
  );

  useEffect(() => {
    if (!isFetchedTeacher) {
      setPendingTeacher(true);
      getTeacher()
        .then((data) => {
          setTeacherList(data);
          setIsFetchedTeacher(true);
          const fullName = row.original.supervisor;
          const teacher = data.find(
            (t) => `${t.name} ${t.surname}` === fullName
          );
          if (teacher) {
            setSupervisorValue(teacher.id);
          }
        })
        .catch(() => {
          setErrorTeacher(true);
        })
        .finally(() => {
          setPendingTeacher(false);
        });
    }
  }, [isFetchedTeacher, row.original.supervisor]);

  useEffect(() => {
    if (!isFetchedGrade) {
      setPendingGrade(true);
      GetGradeData()
        .then((data) => {
          setGradeList(data);
          setIsFetchedGrade(true);
          const grade = data.find((g) => g.level === row.original.grade);
          if (grade) {
            setGradeValue(grade.id.toString());
          }
        })
        .catch(() => {
          setErrorGrade(true);
        })
        .finally(() => {
          setPendingGrade(false);
        });
    }
  }, [isFetchedGrade, row.original.grade]);

  useEffect(() => {
    if (pending) {
      if (state.message !== "") {
        toast(state.message);
        setPending(false);
        onCancel();
      }
    }
  }, [state, onCancel, pending]);

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
    setPending(true);

    const formData = new FormData();
    formData.set("classId", row.original.name);
    formData.set("className", data.className);
    formData.set("capacity", data.capacity);
    formData.set("supervisor", supervisorValue);
    formData.set("grade", gradeValue);

    formAction(formData);
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
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openTeacherList}
                            className="w-[250px] justify-between "
                          >
                            {supervisorValue
                              ? teacherList?.find(
                                  (teacher) => teacher.id === supervisorValue
                                )?.name
                              : pendingTeacher
                              ? "درحال دریافت داده ها ..."
                              : "یک معلم از لیست انتخاب کنید"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0">
                          <Command>
                            <div
                              className="flex items-center border-b px-3 w-full pointer-events-auto"
                              cmdk-input-wrapper=""
                            >
                              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              <input
                                placeholder="نام معلم را جستجو کنید"
                                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                value={searchTeacher}
                                onChange={(e) =>
                                  setSearchTeacher(e.target.value)
                                }
                              />
                            </div>
                            <CommandList>
                              <CommandEmpty>
                                {pendingTeacher
                                  ? "در حال دریافت اطلاعات"
                                  : errorTeacher
                                  ? "دریافت با خطا روبه رو شد"
                                  : "هیچ معلمی یافت نشد"}
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
                              ? gradeList?.find(
                                  (grade) => grade.id === Number(gradeValue)
                                )?.level
                              : pendingGrade
                              ? "درحال دریافت داده ها ..."
                              : "سال تحصیلی را از لیست انتخاب کنید"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0 ">
                          <Command>
                            <CommandList>
                              <CommandEmpty>
                                {pendingGrade
                                  ? "در حال دریافت اطلاعات"
                                  : errorGrade
                                  ? "دریافت با خطا روبه رو شد"
                                  : "هیچ سال تحصیلی ای یافت نشد"}
                              </CommandEmpty>
                              <CommandGroup>
                                {gradeList?.map((grade) => (
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
              disabled={pending || pendingTeacher || pendingGrade}
              type="submit"
            >
              {pending ? (
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
