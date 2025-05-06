"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddClassForm from "./AddClassForm";
import ResponsiveModalForm from "../ResponsiveModalForm";
import { useUserAuth } from "@/hooks/useUserAuth";
import { CirclePlus } from "lucide-react";
import { ColumnsButton } from "../tableComponent/ColumnsButton";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function ClassListDataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);

  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return (
    <div className="flex gap-2 w-full md:w-auto relative">
      <ResponsiveModalForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        close={close}
        title="افزودن کلاس جدید"
        discription="در این بخش میتوانید کلاس جدیدی بسازید"
      >
        <AddClassForm onCancel={close} />
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
