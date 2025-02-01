"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
// import { useState } from "react";
// import DeleteGradeForm from "./DeleteGradeForm";
// import EditGradeForm from "./EditGradeForm";
// import ResponsiveModalForm from "../ResponsiveModalForm";

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
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  // const [isOpenDelete, setIsOpenDelete] = useState(false);
  // const [isOpenEdit, setIsOpenEdit] = useState(false);

  // const closeDelete = () => setIsOpenDelete(false);
  // const openDelete = () => setIsOpenDelete(true);
  // const closeEdit = () => setIsOpenEdit(false);
  // const openEdit = () => setIsOpenEdit(true);
  console.log(row);

  return (
    <>
      {/* <ResponsiveModalForm
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
      </ResponsiveModalForm> */}
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
          <DropdownMenuItem>ویرایش</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>حذف</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
