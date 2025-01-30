"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { deleteGrade } from "@/actions/gradeActions";

interface RowData {
  id: number;
  level: number;
  students: number;
  classes: number;
}

type Row<T> = {
  original: T;
};

interface DataTableRowActionsProps {
  row: Row<RowData>;
  onCancel: () => void;
}

const DeleteGradeForm = ({ onCancel, row }: DataTableRowActionsProps) => {
  const [state, formAction] = useFormState(deleteGrade, { message: "" });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (state.message !== "") {
      toast(state.message);
      setPending(false);
      onCancel();
    }
  }, [state]);

  const expectedText = `remove ${row.original.level} and all ${row.original.classes} classes and all ${row.original.students} students`;

  const formSchema = z.object({
    confirm: z
      .string()
      .nonempty("تاییدیه باید نوشته شود")
      .refine((val) => val === expectedText, {
        message:
          "متن وارد شده مطابقت ندارد. لطفاً جمله موردنظر را دقیقاً تایپ کنید.",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirm: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.confirm !== expectedText) {
      return;
    }
    setPending(true);
    const formData = new FormData();
    const gradeId = row.original.id.toString();
    formData.set("gradeId", gradeId);

    formAction(formData);
  };
  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تایید حذف</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-orange-300"
                    placeholder="متن تایید را بنویسید"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {`برای حذف جمله زیر به رو را به صورت کامل در کادر بنویسید`}
                  <br />
                  <span className="font-semibold">
                    {`remove ${row.original.level} and all ${row.original.classes} classes and all ${row.original.students} students`}
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button
              className="w-full bg-orange-400 hover:bg-orange-300"
              disabled={pending}
              type="submit"
            >
              {pending ? (
                <>
                  <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                  لطفا صبر کنید ...
                </>
              ) : (
                "ثبت"
              )}
            </Button>
            <Button
              className="w-full hover:bg-orange-200"
              variant="outline"
              onClick={onCancel}
              type="button"
            >
              انصراف
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default DeleteGradeForm;
