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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function TeacherDataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  console.log(row);

  return (
    <DropdownMenu dir="rtl">
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
        <DropdownMenuItem disabled>ویرایش</DropdownMenuItem>
        <DropdownMenuItem disabled>حذف</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
