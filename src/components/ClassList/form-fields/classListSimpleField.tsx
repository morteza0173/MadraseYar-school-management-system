import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AddClassFormSchemaProps } from "@/lib/schemas";

export interface FieldConfig {
  name: keyof AddClassFormSchemaProps;
  label: string;
  type?: "text" | "number";
  description?: string;
  defaultValue?: string;
}

interface TitleInputProps {
  form: UseFormReturn<AddClassFormSchemaProps>;
  field: FieldConfig;
}

const ClassListSimpleField = ({ form, field }: TitleInputProps) => {
  const {
    name,
    label,
    type = "text",
    description = "",
    defaultValue = "",
  } = field;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: controllerField }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              className="focus-visible:ring-orange-300"
              type={type}
              placeholder={defaultValue}
              {...controllerField}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default ClassListSimpleField;
