"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CirclePlus, SlidersHorizontal } from "lucide-react";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useState } from "react";
import ResponsiveModalForm from "../ResponsiveModalForm";
import AddAssignmentForm from "./AddAssignmentForm";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function AssignmentDataTableViewOptions<TData>({
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
        title="امتحان جدید"
        discription="امتحان جدید را اضافه کنید"
      >
        <AddAssignmentForm onCancel={close} />
      </ResponsiveModalForm>
      {(userData?.role === "admin" || userData?.role === "teacher") && (
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
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="mr-auto h-8 lg:flex w-full md:w-auto"
          >
            <SlidersHorizontal className="ml-2 h-4 w-4" />
            ستون‌ها
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>نمایش ستون</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
