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
import { SlidersHorizontal } from "lucide-react";


interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function ResultDataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {

  return (
    <div className="flex gap-2 w-full md:w-auto relative">
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
