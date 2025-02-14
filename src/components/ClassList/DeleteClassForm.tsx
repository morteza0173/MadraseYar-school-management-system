"use client";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { DeleteClass } from "@/actions/classAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RowData {
  name: string;
  grade: number;
  capacity: number;
  studentCount: number;
  supervisor?: string;
}

type Row<T> = {
  original: T;
};

interface DataTableRowActionsProps {
  row: Row<RowData>;
  onCancel: () => void;
}

const DeleteClassForm = ({ onCancel, row }: DataTableRowActionsProps) => {
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: FormData) => DeleteClass(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["classDetails"] });
      toast.success(data.message || "کلاس با موفقیت حذف شد");
      setPending(false);
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در حذف کلاس");
      setPending(false);
    },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const formData = new FormData();
    const className = row.original.name;
    formData.set("classId", className);
    mutation.mutate(formData);
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col md:flex-row gap-2 justify-between p-4">
          <Button
            className="w-full md:w-40 bg-orange-400 hover:bg-orange-300"
            disabled={pending}
            type="submit"
          >
            {pending ? (
              <>
                <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                لطفا صبر کنید ...
              </>
            ) : (
              "حذف"
            )}
          </Button>
          <Button
            className="w-full md:w-40 hover:bg-orange-200"
            variant="outline"
            onClick={onCancel}
            type="button"
          >
            انصراف
          </Button>
        </div>
      </form>
    </>
  );
};
export default DeleteClassForm;
