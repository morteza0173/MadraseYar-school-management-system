import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface TitleInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  type?: "text" | "number" | "textarea" | "email" | "password";
  description?: string;
  defaultValue?: string;
  disabled?: boolean;
}

const SimpleField = <T extends FieldValues>({
  form,
  name,
  label,
  type = "text",
  description,
  defaultValue,
  disabled,
}: TitleInputProps<T>) => {
  const textAreaInput = type === "textarea" ? true : false;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: controllerField }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {textAreaInput ? (
              <Textarea
                className="focus-visible:ring-orange-300"
                defaultValue={defaultValue}
                {...controllerField}
                disabled={disabled}
              />
            ) : (
              <Input
                className="focus-visible:ring-orange-300"
                type={type}
                placeholder={defaultValue}
                {...controllerField}
              />
            )}
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default SimpleField;
