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
import EditeventForm from "./EditeventForm";
import DeleteEventForm from "./DeleteEventForm";


type AnnouncementData = {
  id: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  className: string;
};

interface DataTableRowActionsProps<TData extends AnnouncementData> {
  row: Row<TData>;
}

export function EventDataTableRowActions<TData extends AnnouncementData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);

  const closeDelete = () => setIsOpenDelete(false);
  const openDelete = () => setIsOpenDelete(true);
  const closeEdit = () => setIsOpenEdit(false);
  const openEdit = () => setIsOpenEdit(true);
  console.log(row);

  return (
    <>
      <ResponsiveModalForm
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        close={closeEdit}
        title="ویرایش رویداد"
        discription="در این بخش میتوانید رویداد را ویرایش کنید"
      >
        <EditeventForm onCancel={closeEdit} row={row} />
      </ResponsiveModalForm>
      <ResponsiveModalForm
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        close={closeDelete}
        title="حذف رویداد"
        discription="در این بخش میتوانید رویداد را حذف کنید"
      >
        <DeleteEventForm onCancel={closeDelete} row={row} />
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
          {(userData?.role === "admin" || userData?.role === "teacher") && (
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
