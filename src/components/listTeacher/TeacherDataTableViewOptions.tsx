"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useState } from "react";
import ResponsiveModalForm from "../ResponsiveModalForm";
import AddTeacherForm from "./AddTeacherForm";
import { ColumnsButton } from "../tableComponent/ColumnsButton";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function TeacherDataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return (
    <div className="flex gap-2 w-full md:w-auto relative">
      <ResponsiveModalForm
        close={close}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="یک معلم جدید اضافه کنید"
        discription="معلم جدید با اطلاعات کاربری خود میتواند وارد سایت شود"
      >
        <AddTeacherForm onCancel={close} />
      </ResponsiveModalForm>
      {userData?.role === "admin" && (
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8 lg:flex w-full md:w-auto"
          onClick={open}
        >
          <CirclePlus className="ml-2 h-4 w-4" />
          افزودن
        </Button>
      )}
      <ColumnsButton table={table} />
    </div>
  );
}
