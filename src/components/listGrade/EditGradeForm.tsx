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
import { EditGrade } from "@/actions/gradeActions";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { GradeFormSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

const EditGradeForm = ({ onCancel, row }: DataTableRowActionsProps) => {
  const queryClient = useQueryClient();

  const {mutate,isPending} = useMutation({
    mutationFn: async (data: FormData) => EditGrade(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["grade"] });
      queryClient.invalidateQueries({ queryKey: ["classDetails"] });
      toast.success(data.message || "با موفقیت ثبت شد");
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در ثبت");
    },
  });

  const form = useForm<z.infer<typeof GradeFormSchema>>({
    resolver: zodResolver(GradeFormSchema),
    defaultValues: {
      grade: row.original.level.toString(),
    },
  });

  const onSubmit = async (data: z.infer<typeof GradeFormSchema>) => {
    const formData = new FormData();
    formData.set("grade", data.grade);
    formData.set("gradeId", row.original.id.toString());
    mutate(formData);
  };
  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>سال تحصیلی</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-orange-300"
                    type="number"
                    placeholder="12"
                    {...field}
                  />
                </FormControl>
                <FormDescription>به صورت عدد وارد کنید </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button
              className="w-full bg-orange-400 hover:bg-orange-300"
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <>
                  <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                  لطفا صبر کنید ...
                </>
              ) : (
                "ویرایش"
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
export default EditGradeForm;
