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
import { useGetClassDetails } from "@/hooks/useGetClassDetails";
import { useUserAuth } from "@/hooks/useUserAuth";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, TriangleAlert } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface Row<T> {
  original: T;
}

interface TitleInputProps<T extends FieldValues, R> {
  form: UseFormReturn<T>;
  row?: Row<R>;
  classValue: string | undefined;
  setClassValue: Dispatch<SetStateAction<string | undefined>>;
  fieldName: Path<T>;
  rowKey?: keyof R;
  description?: string;
  hasClearButton?: boolean;
}
const ClassSelectField = <T extends FieldValues, R>({
  form,
  row,
  classValue,
  setClassValue,
  fieldName,
  rowKey,
  description,
  hasClearButton,
}: TitleInputProps<T, R>) => {
  const descriptionText = description ? description : "کلاس را انتخاب کنید";
  const [openClassList, setOpenClassList] = useState(false);

  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const {
    data: ClassData,
    refetch: classRefetch,
    isError: isClassError,
    isPending: isClassPending,
  } = useGetClassDetails(userData);

  useEffect(() => {
    if (
      row &&
      rowKey &&
      row.original[rowKey] &&
      typeof row.original[rowKey] === "string"
    ) {
      if (!isClassError && !isClassPending) {
        const className = row?.original[rowKey];
        const classRow = ClassData?.find((c) => c.name === className);
        if (classRow) {
          setClassValue(classRow.name);
        }
      }
    }
  }, [isClassError, isClassPending, row, ClassData, rowKey, setClassValue]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>انتخاب کلاس</FormLabel>
            <FormControl>
              <div className="flex gap-2">
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
                        ? ClassData?.find((Class) => Class.name === classValue)
                            ?.name
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
                {hasClearButton && (
                  <Button
                    variant="outline"
                    type="button"
                    size="icon"
                    onClick={() => {
                      setClassValue("");
                      const defaultValue = form.getValues(fieldName);
                      form.setValue(fieldName, defaultValue);
                    }}
                  >
                    ×
                  </Button>
                )}
              </div>
            </FormControl>
          </div>
          <FormDescription>{descriptionText}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ClassSelectField;
