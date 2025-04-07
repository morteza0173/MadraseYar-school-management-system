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
import EditExamForm from "./EditExamForm";
import DeleteExamForm from "./DeleteExamForm";
import { useRouter } from "next/navigation";

type AnnouncementData = {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  className: string;
  lessonName: string;
  lessonId?: number | undefined;
  classId?: number | undefined;
};

interface DataTableRowActionsProps<TData extends AnnouncementData> {
  row: Row<TData>;
}

export function ExamDataTableRowActions<TData extends AnnouncementData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
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
        title="ویرایش امتحان"
        discription="در این بخش میتوانید امتحان را ویرایش کنید"
      >
        <EditExamForm onCancel={closeEdit} row={row} />
      </ResponsiveModalForm>
      <ResponsiveModalForm
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        close={closeDelete}
        title="حذف امتحان"
        discription="در این بخش میتوانید رویداد را حذف کنید"
      >
        <DeleteExamForm onCancel={closeDelete} row={row} />
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
          <DropdownMenuItem
            onClick={() => {
              sessionStorage.setItem("previousPath", window.location.pathname);
              router.push(`/list/result/امتحان/${row.original.id}`);
            }}
            className="cursor-pointer"
          >
            جزئیات
          </DropdownMenuItem>
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
