"use client";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LessonsListSchema } from "@/lib/schemas";
import { DeleteLesson } from "@/actions/lessonsAction";

type Row<T> = {
  original: T;
};

interface DataTableRowActionsProps {
  row: Row<LessonsListSchema>;
  onCancel: () => void;
}

const DeleteLessonForm = ({ onCancel, row }: DataTableRowActionsProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => DeleteLesson(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success(data.message || "کلاس با موفقیت حذف شد");
      onCancel();
    },
    onError: (error) => {
      toast.error(error.message || "خطا در حذف کلاس");
    },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    const lessonId = row.original.lessonId;
    formData.set("id", String(lessonId));
    mutate(formData);
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col md:flex-row gap-2 justify-between p-4">
          <Button
            className="w-full md:w-40 bg-orange-400 hover:bg-orange-300"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
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
export default DeleteLessonForm;
