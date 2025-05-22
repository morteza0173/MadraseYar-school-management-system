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
import { useGetLessonsData } from "@/hooks/useGetLessonsData";
import { useUserAuth } from "@/hooks/useUserAuth";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, TriangleAlert } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface Row<T> {
  original: T;
}

interface TitleInputProps<T extends FieldValues, R> {
  form: UseFormReturn<T>;
  row?: Row<R>;
  lessonValue: number | undefined;
  setLessonValue: Dispatch<SetStateAction<number | undefined>>;
  fieldName: Path<T>;
  rowKey?: keyof R;
  description?: string;
}

const LessonSelectField = <T extends FieldValues, R>({
  form,
  lessonValue,
  setLessonValue,
  fieldName,
  description,
}: TitleInputProps<T, R>) => {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const {
    data: lessonsData,
    isPending: isLessonsPending,
    isError: isLessonsError,
    refetch: lessonsRefetch,
  } = useGetLessonsData(userData);
  const { data: ClassData } = useGetClassDetails(userData);
  const [openLessonList, setOpenLessonList] = useState(false);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>انتخاب درس</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Popover
                  modal
                  open={openLessonList}
                  onOpenChange={setOpenLessonList}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openLessonList}
                      className="w-[250px] justify-between "
                    >
                      {lessonValue
                        ? (() => {
                            const selectedLesson = lessonsData?.find(
                              (lesson) => lesson.lessonId === lessonValue
                            );
                            const className = ClassData?.find(
                              (classItem) =>
                                classItem.name === selectedLesson?.className
                            )?.name;

                            return selectedLesson
                              ? `${selectedLesson.lessonName} ${
                                  className ? `(${className})` : ""
                                }`
                              : "درس انتخاب‌شده نامشخص است";
                          })()
                        : "درس را از لیست انتخاب کنید"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] p-0 ">
                    <Command>
                      <CommandList>
                        <CommandEmpty>
                          <div className="flex items-center justify-center h-full w-full">
                            {isLessonsPending ? (
                              <div className="flex gap-2 items-center">
                                <Loader2 className="size-4 animate-spin" />
                                <p>در حال دریافت اطلاعات</p>
                              </div>
                            ) : isLessonsError ? (
                              <div className="flex flex-col gap-4 items-center">
                                <div className="flex gap-2">
                                  <TriangleAlert className="size-4" />
                                  <p className="text-xs font-semibold">
                                    اینترنت خود را ببرسی کنید
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  onClick={() => lessonsRefetch()}
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
                          {lessonsData?.map((lesson) => (
                            <CommandItem
                              key={lesson.lessonName}
                              className="z-[60] pointer-events-auto overflow-auto"
                              value={String(lesson.lessonId)}
                              onSelect={(currentValue) => {
                                const selectedValue =
                                  currentValue === String(lessonValue)
                                    ? ""
                                    : currentValue;
                                setLessonValue(Number(selectedValue));
                                field.onChange(selectedValue);
                                setOpenLessonList(false);
                              }}
                            >
                              {(() => {
                                const className = ClassData?.find(
                                  (classItem) =>
                                    classItem.name === lesson.className
                                )?.name;

                                return `${lesson.lessonName} ${
                                  className ? `(${className})` : ""
                                }`;
                              })()}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  lessonValue === lesson.lessonId
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
              </div>
            </FormControl>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default LessonSelectField;
