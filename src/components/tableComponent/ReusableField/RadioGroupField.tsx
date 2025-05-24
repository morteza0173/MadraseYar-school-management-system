import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReactNode } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface TitleInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  description?: string;
  children: ReactNode;
  labelName: string;
}

const RadioGroupField = <T extends FieldValues>({
  form,
  fieldName,
  description,
  children,
  labelName,
}: TitleInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{labelName}</FormLabel>
          <FormControl>
            <RadioGroup
              dir="rtl"
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-row gap-2 h-9 justify-around"
            >
              {children}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default RadioGroupField;

interface RadioGroupProps {
  value: string;
  label: string;
}

RadioGroupField.Option = function RadioGroup({
  value,
  label,
}: RadioGroupProps) {
  return (
    <FormItem className="flex items-center">
      <FormControl>
        <RadioGroupItem value={value} />
      </FormControl>
      <FormLabel className="m-2">{label}</FormLabel>
    </FormItem>
  );
};
