import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useGetTeacher from "@/hooks/useGetTeacher";
import { AddClassFormSchemaProps } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  Search,
  TriangleAlert,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

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

interface TitleInputProps {
  form: UseFormReturn<AddClassFormSchemaProps>;
  row?: Row<RowData>;
  supervisorValue: string;
  setSupervisorValue: Dispatch<SetStateAction<string>>;
}

const ClassListSelectTeacherField = ({
  form,
  row,
  supervisorValue,
  setSupervisorValue,
}: TitleInputProps) => {
  const [openTeacherList, setOpenTeacherList] = useState(false);
  const { isTeacherError, isTeacherPending, teacherData, teacherRefetch } =
    useGetTeacher();
  const [searchTeacher, setSearchTeacher] = useState("");

  const filteredTeacherList = teacherData?.filter((teacher) => {
    if (!searchTeacher) return true;

    const fullName = `${teacher.name} ${teacher.surname}`.toLowerCase();
    return fullName.includes(searchTeacher.toLowerCase());
  });

  useEffect(() => {
    if (row?.original?.supervisor && row.original.supervisor.length > 0) {
      if (!isTeacherPending && !isTeacherError) {
        const fullName = row.original.supervisor;
        const teacher = teacherData?.find(
          (t) => `${t.name} ${t.surname}` === fullName
        );
        if (teacher) {
          setSupervisorValue(teacher.id);
        }
      }
    }
  }, [
    isTeacherPending,
    row?.original?.supervisor,
    isTeacherError,
    teacherData,
    setSupervisorValue,
  ]);

  return (
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
                            onChange={(e) => setSearchTeacher(e.target.value)}
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
  );
};
export default ClassListSelectTeacherField;
