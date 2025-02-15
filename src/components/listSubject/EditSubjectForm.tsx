"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { SubjectFormSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubjectAction } from "@/actions/subjectAction";

interface RowData {
  name: string;
}

type Row<T> = {
  original: T;
};

interface DataTableRowActionsProps {
  row: Row<RowData>;
  onCancel: () => void;
}

const EditSubjectForm = ({ onCancel, row }: DataTableRowActionsProps) => {
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => updateSubjectAction(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success(data.message || "با موفقیت ثبت شد");
      setPending(false);
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در ثبت");
      setPending(false);
    },
  });

  const form = useForm<z.infer<typeof SubjectFormSchema>>({
    resolver: zodResolver(SubjectFormSchema),
    defaultValues: {
      name: row.original.name,
    },
  });

  const onSubmit = async (data: z.infer<typeof SubjectFormSchema>) => {
    setPending(true);
    console.log(pending);

    const formData = new FormData();
    formData.set("newSubjectName", data.name);
    formData.set("oldSubjectName", row.original.name);
    mutation.mutate(formData);
  };
  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حوزه تحصیلی</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-orange-300"
                    type="text"
                    placeholder="12"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription> </FormDescription> */}
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
export default EditSubjectForm;
