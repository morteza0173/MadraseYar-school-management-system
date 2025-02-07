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
import { gradeListProps } from "@/actions/gradeActions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Loader2Icon, Search } from "lucide-react";
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
import { AddClass } from "@/actions/classAction";
import { AddClassFormSchema } from "@/lib/schemas";

interface AddClassFormProps {
  teacherList: teacherListProps[] | null;
  gradeList: gradeListProps[] | null;
  onCancel: () => void;
}

const AddClassForm = ({
  onCancel,
  teacherList,
  gradeList,
}: AddClassFormProps) => {
  const [state, formAction] = useFormState(AddClass, { message: "" });
  const [pending, setPending] = useState(false);

  const [openTeacherList, setOpenTeacherList] = useState(false);
  const [supervisorValue, setSupervisorValue] = useState("");
  const [searchTeacher, setSearchTeacher] = useState("");
  const filteredTeacherList = teacherList?.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTeacher.toLowerCase())
  );

  const [openGradeList, setOpenGradeList] = useState(false);
  const [gradeValue, setGradeValue] = useState("");

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
      className: "",
      capacity: "",
      supervisorId: "",
      grade: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof AddClassFormSchema>) => {
    setPending(true);

    const formData = new FormData();
    formData.set("className", data.className);
    formData.set("capacity", data.capacity);
    formData.set("supervisor", data.supervisorId);
    formData.set("grade", data.grade);

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
                              ? teacherList?.find(
                                  (teacher) => teacher.id === supervisorValue
                                )?.name
                              : "یک معلم از لیست انتخاب کنید"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0">
                          <Command>
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
                            <CommandList>
                              <CommandEmpty>هیچ معلمی پیدا نشد</CommandEmpty>
                              <CommandGroup>
                                {filteredTeacherList?.map((teacher) => (
                                  <CommandItem
                                    key={teacher.id}
                                    className="z-[60]"
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
                              : "سال تحصیلی را از لیست انتخاب کنید"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0 ">
                          <Command>
                            <CommandList>
                              <CommandEmpty>
                                هیچ سال تحصیلی ای یافت نشد
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
              disabled={pending}
              type="submit"
            >
              {pending ? (
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
export default AddClassForm;
