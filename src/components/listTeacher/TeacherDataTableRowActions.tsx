"use client";

import { Row } from "@tanstack/react-table";

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
import EditTeacherForm from "./EditTeacherForm";
import DeleteTeacherForm from "./DeleteTeacherForm";

type TeacherData = {
  id: string;
  label: {
    name: string;
    email?: string;
    img?: string;
  };
  classes: string;
  eventOnGoing: number;
  phone?: string;
  subject?: string;
};

interface DataTableRowActionsProps<TData extends TeacherData> {
  row: Row<TData>;
}

export function TeacherDataTableRowActions<TData extends TeacherData>({
  row,
}: DataTableRowActionsProps<TData>) {
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
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        close={closeEdit}
        title="ویرایش معلم"
        discription="در این بخش میتوانید اطلاعات معلم را ویرایش کنید"
      >
        <EditTeacherForm onCancel={closeEdit} row={row} />
      </ResponsiveModalForm>
      <ResponsiveModalForm
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        close={closeDelete}
        title="حذف معلم"
        discription="در این بخش میتوانید معلم را حذف کنید"
      >
        <DeleteTeacherForm onCancel={closeDelete} row={row} />
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
