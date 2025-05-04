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
import { useUserAuth } from "@/hooks/useUserAuth";
import ResponsiveModalForm from "../ResponsiveModalForm";
import { useState } from "react";
import EditParentForm from "./EditParentForm";
import DeleteParentForm from "./DeleteParentForm";
import { ParentSingleType } from "@/db/queries/getParent";

interface DataTableRowActionsProps<TData extends ParentSingleType> {
  row: Row<TData>;
}

export function ParentDataTableRowActions<TData extends ParentSingleType>({
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
        title="ویرایش والد"
        discription="در این بخش میتوانید اطلاعات والد را ویرایش کنید"
      >
        <EditParentForm onCancel={closeEdit} row={row} />
      </ResponsiveModalForm>
      <ResponsiveModalForm
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        close={closeDelete}
        title="حذف والد"
        discription="در این بخش میتوانید والد را حذف کنید"
      >
        <DeleteParentForm onCancel={closeDelete} row={row} />
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
          <DropdownMenuItem disabled>ارسال پیام</DropdownMenuItem>
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
