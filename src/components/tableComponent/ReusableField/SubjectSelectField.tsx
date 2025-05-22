import { Check, ChevronsUpDown, Loader2, TriangleAlert } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Button } from "@/components/ui/button";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useGetSubjects } from "@/hooks/useGetSubjects";
import { cn } from "@/lib/utils";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Row<T> = {
  original: T;
};

interface TitleInputProps<T extends FieldValues, R> {
  form: UseFormReturn<T>;
  row?: Row<R>;
  subjectValue: string;
  setSubjectValue: Dispatch<SetStateAction<string>>;
  fieldName: Path<T>;
  rowKey?: keyof R;
  description?: string;
  formLable?: string;
}

const SubjectSelectField = <T extends FieldValues, R>({
  form,
  row,
  subjectValue,
  setSubjectValue,
  fieldName,
  rowKey,
  description,
  formLable,
}: TitleInputProps<T, R>) => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const {
    isError: isSubjectError,
    isPending: isSubjectPending,
    data: subjectData,
    refetch: subjectRefetch,
  } = useGetSubjects(userData);
  const [openSubjectList, setOpenSubjectList] = useState(false);

  useEffect(() => {
    if (row && rowKey && row.original[rowKey]) {
      if (!isSubjectPending && !isSubjectError) {
        const subjectName = row.original[rowKey];
        const subject = subjectData?.find((s) => s.name === subjectName);
        if (subject) {
          setSubjectValue(subject.name);
        }
      }
    }
  }, [
    isSubjectError,
    isSubjectPending,
    row,
    subjectData,
    rowKey,
    setSubjectValue,
  ]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>{formLable}</FormLabel>
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
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default SubjectSelectField;
