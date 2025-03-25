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

import { UserSex } from "@prisma/client";
import EditStudentForm from "./EditStudentForm";
import DeleteStudentForm from "./DeleteStudentForm";

type StudentData = {
  id: string;
  label: {
    name: string;
    email?: string | undefined;
    img?: string | undefined;
  };
  phone?: string | undefined;
  address: string;
  sex: UserSex;
  parent: {
    id: string;
    name: string;
  };
  class: {
    id: number;
    name: string;
  };
  grade: number;
  upcomingAssignments: number;
  upcomingExams: number;
  averageScore: number;
};

interface DataTableRowActionsProps<TData extends StudentData> {
  row: Row<TData>;
}

export function StudentDataTableRowActions<TData extends StudentData>({
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
        title="ویرایش دانش‌آموز"
        discription="در این بخش میتوانید اطلاعات دانش‌آموز را ویرایش کنید"
      >
        <EditStudentForm onCancel={closeEdit} row={row} />
      </ResponsiveModalForm>
      <ResponsiveModalForm
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        close={closeDelete}
        title="حذف دانش‌آموز"
        discription="در این بخش میتوانید دانش‌آموز را حذف کنید"
      >
        <DeleteStudentForm onCancel={closeDelete} row={row} />
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
          <DropdownMenuItem disabled>لیست تکالیف یپش رو</DropdownMenuItem>
          <DropdownMenuItem disabled>لیست امتحانات یپش رو</DropdownMenuItem>
          <DropdownMenuItem disabled>لیست نمرات</DropdownMenuItem>
          <DropdownMenuItem disabled>حضور و غیاب</DropdownMenuItem>
          {userData?.role === "admin" && (
            <>
              <DropdownMenuItem disabled>نمایش والد</DropdownMenuItem>
              <DropdownMenuItem onClick={openEdit}>ویرایش</DropdownMenuItem>
              <DropdownMenuItem onClick={openDelete}>حذف</DropdownMenuItem>
            </>
          )}
          {userData?.role === "teacher" && (
            <>
              <DropdownMenuItem disabled>ثبت نمره</DropdownMenuItem>
              <DropdownMenuItem disabled>نمایش والد</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
