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
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  Search,
  TriangleAlert,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface Row<T> {
  original: T;
}

interface TitleInputProps<T extends FieldValues, R> {
  form: UseFormReturn<T>;
  row?: Row<R>;
  teacherValue: string;
  setTeacherValue: Dispatch<SetStateAction<string>>;
  fieldName: Path<T>;
  rowKey?: keyof R;
}

const TeacherSelectField = <T extends FieldValues, R>({
  form,
  row,
  teacherValue,
  setTeacherValue,
  fieldName,
  rowKey,
}: TitleInputProps<T, R>) => {
  const [openTeacherList, setOpenTeacherList] = useState(false);
  const { isTeacherError, isTeacherPending, teacherData, teacherRefetch } =
    useGetTeacher();
  const [searchTeacher, setSearchTeacher] = useState("");

  const filteredTeacherList = teacherData?.filter((teacher) => {
    if (!searchTeacher) return true;

    const fullName = `${teacher.name} ${teacher.surname}`.toLowerCase();
    return fullName.includes(searchTeacher.toLowerCase());
  });

  const selectedTeacher = teacherData?.find(
    (teacher) => teacher.id === teacherValue
  );

  useEffect(() => {
    if (
      row &&
      rowKey &&
      row.original[rowKey] &&
      typeof row.original[rowKey] === "string"
    ) {
      if (!isTeacherPending && !isTeacherError) {
        const fullName = row.original[rowKey] as string;
        const teacher = teacherData?.find(
          (t) => `${t.name} ${t.surname}` === fullName
        );
        if (teacher) {
          setTeacherValue(teacher.id);
        }
      }
    }
  }, [
    isTeacherPending,
    row,
    rowKey,
    isTeacherError,
    teacherData,
    setTeacherValue,
  ]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
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
  );
};
export default TeacherSelectField;
