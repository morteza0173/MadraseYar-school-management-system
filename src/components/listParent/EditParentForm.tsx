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
import { Loader2Icon } from "lucide-react";
import { ParentEditFormSchemas } from "@/lib/schemas";
import { Textarea } from "../ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditParentData } from "@/actions/parentAction";
import { ParentSingleType } from "@/db/queries/getParent";

type Row<T> = {
  original: T;
};

interface EditParentFormProps {
  onCancel: () => void;
  row: Row<ParentSingleType>;
}

const EditParentForm = ({ onCancel, row }: EditParentFormProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => EditParentData(data),
    onSuccess: (data) => {
      toast.success(data.message || "والد با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["parent"] });
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در ویرایش کردن والد");
    },
  });

  const form = useForm<z.infer<typeof ParentEditFormSchemas>>({
    resolver: zodResolver(ParentEditFormSchemas),
    defaultValues: {
      name: row.original.name,
      surname: row.original.surname,
      phone: row.original.phone,
      address: row.original.address,
      username: row.original.username,
    },
  });

  const onSubmit = async (data: z.infer<typeof ParentEditFormSchemas>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("surname", data.surname);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("username", data.username);
    formData.append("id", row.original.id);

    mutate(formData);
  };

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-row gap-4 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>نام</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-orange-300 "
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>نام خانوادگی</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-orange-300"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>نام کاربری</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-orange-300"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>شماره تماس</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-orange-300"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>با 09 شروع میشود</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>ادرس</FormLabel>
                <FormControl>
                  <Textarea
                    className="focus-visible:ring-orange-300"
                    placeholder="ادرس خود را وارد کنید ..."
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
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
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
export default EditParentForm;
