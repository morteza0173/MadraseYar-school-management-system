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
import { createSubjectAction } from "@/actions/subjectAction";
const AddSubjectForm = ({ onCancel }: { onCancel: () => void }) => {
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => createSubjectAction(data),
    onSuccess: (data) => {
      toast.success(data.message || "با موفقیت ثبت شد");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setPending(false);
      onCancel();
    },
    onError: (data) => {
      toast.error(data.message || "خطا در ثبت");
      setPending(false);
    },
  });

  const form = useForm<z.infer<typeof SubjectFormSchema>>({
    resolver: zodResolver(SubjectFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SubjectFormSchema>) => {
    setPending(true);
    console.log(pending);

    const formData = new FormData();
    formData.set("subjectName", data.name);
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
                <FormLabel>حوزه تدریس</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-orange-300"
                    type="text"
                    placeholder="ریاضی"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
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
export default AddSubjectForm;
