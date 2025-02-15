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
import DeleteSubjectForm from "./DeleteSubjectForm";
import EditSubjectForm from "./EditSubjectForm";

interface RowData {
  name: string;
  teacherCount: number;
  lessonCount: number;
}

type Row<T> = {
  original: T;
};

interface DataTableRowActionsProps {
  row: Row<RowData>;
}

export function SubjectListDataTableRowActions({
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
        title="حذف حوزه تدریس"
        discription="حوزه تدریس حذف خواهد شد. آیا مطمئن هستید؟"
      >
        <DeleteSubjectForm onCancel={closeDelete} row={row} />
      </ResponsiveModalForm>
      <ResponsiveModalForm
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        close={closeEdit}
        title="ویرایش حوزه تدریس"
        discription="این بخش درواقع دسته بندی ای برای دروس میباشد . مثلا ریاضی 1 و ریاضی 2 در حوزه تحصیلی ریاضی میباشد ."
      >
        <EditSubjectForm onCancel={closeEdit} row={row} />
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
