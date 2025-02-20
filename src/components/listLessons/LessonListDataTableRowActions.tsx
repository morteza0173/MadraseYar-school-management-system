"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import ResponsiveModalForm from "../ResponsiveModalForm";
import { useState } from "react";
import { useUserAuth } from "@/hooks/useUserAuth";
import { LessonsListSchema } from "@/lib/schemas";
import DeleteLessonForm from "./DeleteLessonForm";
import EditLessonsForm from "./EditLessonForm";


type Row<T> = {
  original: T;
};

interface DataTableRowActionsProps {
  row: Row<LessonsListSchema>;
}

export function LessonListDataTableRowActions({
  row,
}: DataTableRowActionsProps) {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);

  const closeDelete = () => setIsOpenDelete(false);
  const openDelete = () => setIsOpenDelete(true);
  const closeEdit = () => setIsOpenEdit(false);
  const openEdit = () => setIsOpenEdit(true);

  return (
    <>
      <ResponsiveModalForm
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        close={closeDelete}
        title="حذف درس"
        discription="میتوانید با حذف کردن درس آن را از برنامه هفتگی حذف کنید"
      >
        <DeleteLessonForm onCancel={closeDelete} row={row} />
      </ResponsiveModalForm>
      <ResponsiveModalForm
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        close={closeEdit}
        title="ویرایش درس"
        discription="در این بخش میتوانید درس را ویرایش و ساعت شروع کلاس را تغییر دهید"
      >
        <EditLessonsForm onCancel={closeEdit} row={row} />
      </ResponsiveModalForm>
      <DropdownMenu dir="rtl" modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem disabled>جزئیات</DropdownMenuItem>
          {userData?.role === "admin" && (
            <>
              <DropdownMenuItem onClick={openEdit}>ویرایش</DropdownMenuItem>
              <DropdownMenuItem onClick={openDelete}>حذف</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
