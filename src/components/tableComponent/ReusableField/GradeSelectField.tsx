import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
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

import { cn } from "@/lib/utils";
import { useGetGradeData } from "@/hooks/useGetGradeData";

type Row<T> = {
  original: T;
};

interface TitleInputProps<T extends FieldValues, R> {
  form: UseFormReturn<T>;
  row?: Row<R>;
  gradeValue: string;
  setGradeValue: Dispatch<SetStateAction<string>>;
  fieldName: Path<T>;
  rowKey?: keyof R;
}

const GradeSelectField = <T extends FieldValues, R>({
  form,
  row,
  gradeValue,
  setGradeValue,
  fieldName,
  rowKey,
}: TitleInputProps<T, R>) => {
  const [openGradeList, setOpenGradeList] = useState(false);
  const {
    data: gradeData,
    refetch: gradeRefetch,
    isError: isGradeError,
    isPending: isGradePending,
  } = useGetGradeData();

  useEffect(() => {
    if (row && rowKey && row.original[rowKey]) {
      if (!isGradePending && !isGradeError) {
        const grade = gradeData?.find((g) => g.level === row.original[rowKey]);
        if (grade) {
          setGradeValue(grade.id.toString());
        }
      }
    }
  }, [isGradePending, row, isGradeError, gradeData, setGradeValue, rowKey]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
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
  );
};
export default GradeSelectField;
