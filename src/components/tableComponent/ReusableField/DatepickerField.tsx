import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface TitleInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  formDescription?: string;
  formLabel: string;
}

const DatepickerField = <T extends FieldValues>({
  form,
  fieldName,
  formDescription,
  formLabel,
}: TitleInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{formLabel}</FormLabel>
          <FormControl>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Input
                  readOnly
                  value={
                    field.value
                      ? new Date(field.value).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          timeZone: "Asia/Tehran",
                        })
                      : "تاریخ را انتخاب کنید"
                  }
                  placeholder="تاریخ را انتخاب کنید"
                  className="cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  disabled={{ before: new Date() }}
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(date?.toISOString());
                  }}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          {formDescription && (
            <FormDescription>{formDescription}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default DatepickerField;
