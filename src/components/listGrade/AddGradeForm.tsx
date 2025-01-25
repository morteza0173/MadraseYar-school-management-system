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
import { AddGrade } from "@/actions/gradeActions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SubmitButton from "../SubmitButton";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
  grade: z
    .string()
    .nonempty("سال تحصیلی نمی‌تواند خالی باشد.")
    .refine((val) => {
      const num = Number(val);
      return num > 0;
    }, "سال تحصیلی باید بزرگ‌تر از صفر باشد."),
});

const AddGradeForm = ({ onCancel }: { onCancel: () => void }) => {
  const [state, formAction] = useFormState(AddGrade, { message: "" });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (state.message !== "") {
      toast(state.message);
      setPending(false);
      onCancel();
    }
  }, [state]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setPending(true);
    console.log(pending);

    const formData = new FormData();
    formData.set("grade", data.grade);
    formAction(formData);
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
export default AddGradeForm;
