"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import ResponsiveModalForm from "../ResponsiveModalForm";
import DeleteGradeForm from "./DeleteGradeForm";
import EditGradeForm from "./EditGradeForm";
import { useUserAuth } from "@/hooks/useUserAuth";

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
}

export function GradeListDataTableRowActions({
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
        title="حذف سال تحصیلی"
        discription="سال تحصیلی به همراه کلاس ها و دانش آموزان و خانواده هایی که دانش آموز دیگر در مدرسه ندارند به طور کامل حذف خواهد شد "
      >
        <DeleteGradeForm onCancel={closeDelete} row={row} />
      </ResponsiveModalForm>
      <ResponsiveModalForm
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        close={closeEdit}
        title="ویرایش سال تحصیلی"
        discription="دقت کنید که سال تحصیلی نمیتواند تکراری باشد"
      >
        <EditGradeForm onCancel={closeEdit} row={row} />
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
              <DropdownMenuItem onClick={openEdit} className="cursor-pointer">
                ویرایش
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openDelete} className="cursor-pointer">
                حذف
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
