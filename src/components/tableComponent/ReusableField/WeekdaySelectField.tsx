import { Check, ChevronsUpDown } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";

type Row<T> = {
  original: T;
};

interface TitleInputProps<T extends FieldValues, R> {
  form: UseFormReturn<T>;
  row?: Row<R>;
  fieldName: Path<T>;
  rowKey?: keyof R;
  description?: string;
  formLable?: string;
}

const days = [
  { label: "شنبه", value: "SATURDAY" },
  { label: "یکشنبه", value: "SUNDAY" },
  { label: "دوشنبه", value: "MONDAY" },
  { label: "سه‌شنبه", value: "TUESDAY" },
  { label: "چهارشنبه", value: "WEDNESDAY" },
];

const WeekdaySelectField = <T extends FieldValues, R>({
  form,
  row,
  fieldName,
  rowKey,
  description,
  formLable,
}: TitleInputProps<T, R>) => {
  const [openDayList, setOpenDayList] = useState(false);
  const selectedDay = form.watch(fieldName);

  useEffect(() => {
    if (row && rowKey && row.original[rowKey]) {
      const selectedDay = row.original[rowKey];
      const day = days?.find((day) => day.label === selectedDay);
      if (day) {
        form.setValue(fieldName, day.value as PathValue<T, Path<T>>);
      }
    }
  }, [row, form, fieldName, rowKey]);

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
                <Popover open={openDayList} onOpenChange={setOpenDayList} modal>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDayList}
                      className="w-[250px] justify-between "
                    >
                      {selectedDay
                        ? days.find((day) => day.value === selectedDay)?.label
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
                                form.setValue(
                                  fieldName,
                                  currentValue as PathValue<T, Path<T>>
                                );
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
          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default WeekdaySelectField;
