import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FormField, FormMessage } from "@/components/ui/form";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

interface TitleInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  disabledField?: boolean;
  labelName: string;
  description?: string;
}

const UploadImageField = <T extends FieldValues>({
  form,
  fieldName,
  disabledField,
  labelName,
  description,
}: TitleInputProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(fieldName, file as PathValue<T, Path<T>>);
    }
  };

  function isFile(value: unknown): value is File {
    return value instanceof File;
  }

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-5">
            {field.value ? (
              <div className="size-[72px] relative rounded-md overflow-hidden">
                <Image
                  src={
                    field.value && isFile(field.value)
                      ? URL.createObjectURL(field.value)
                      : field.value || "/fallback.jpg"
                  }
                  alt="teacher avatar"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <Avatar className="size-[72px]">
                <AvatarFallback>
                  <ImageIcon className="size-[36px] text-neutral-400" />
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col gap-y-1">
              <p>{labelName}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
              <input
                className="hidden"
                accept=".jpg , .png , .jpeg , .svg"
                type="file"
                ref={inputRef}
                onChange={handleImageChange}
                disabled={disabledField}
              />
              {field.value ? (
                <Button
                  size="sm"
                  type="button"
                  disabled={disabledField}
                  variant="destructive"
                  className="w-fit mt-2"
                  onClick={() => {
                    field.onChange(null);
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                  }}
                >
                  حذف تصویر
                </Button>
              ) : (
                <Button
                  size="sm"
                  type="button"
                  disabled={disabledField}
                  variant="secondary"
                  className="w-fit mt-2 bg-sky-400 hover:bg-sky-300 "
                  onClick={() => inputRef.current?.click()}
                >
                  آپلود تصویر
                </Button>
              )}
              <FormMessage />
            </div>
          </div>
        </div>
      )}
    />
  );
};
export default UploadImageField;
