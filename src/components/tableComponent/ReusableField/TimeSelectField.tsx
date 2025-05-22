import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

interface TitleInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  formLable?: string;
  hourFieldName: Path<T>;
  minuteFieldName: Path<T>;
}

const TimeSelectField = <T extends FieldValues>({
  form,
  fieldName,
  formLable,
  hourFieldName,
  minuteFieldName,
}: TitleInputProps<T>) => {
  const adjustTime = (field: Path<T>, amount: number) => {
    const currentVal = form.getValues(field) as number;
    const max = field.toString().includes("Hour") ? 23 : 59;
    const newVal = Math.min(Math.max(currentVal + amount, 0), max);
    form.setValue(field, newVal as PathValue<T, Path<T>>);
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex gap-2 items-center justify-between">
              <FormLabel>{formLable}</FormLabel>
              <div className="flex md:gap-2 justify-center  items-center">
                {/* دقیقه شروع */}
                <div className="flex flex-col items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => adjustTime(minuteFieldName, 5)}
                  >
                    <ChevronUp />
                  </Button>
                  <Input
                    value={form.watch(minuteFieldName)}
                    className="w-10 md:w-12 text-center"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => adjustTime(minuteFieldName, -5)}
                  >
                    <ChevronDown />
                  </Button>
                </div>
                {/* ساعت شروع */}
                <div className="flex flex-col items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => adjustTime(hourFieldName, 1)}
                  >
                    <ChevronUp />
                  </Button>
                  <Input
                    value={field.value}
                    className="w-10 md:w-12 text-center"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => adjustTime(hourFieldName, -1)}
                  >
                    <ChevronDown />
                  </Button>
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default TimeSelectField;
