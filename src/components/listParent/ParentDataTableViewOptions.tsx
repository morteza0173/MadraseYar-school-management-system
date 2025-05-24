"use client";

import { Table } from "@tanstack/react-table";
import { ColumnsButton } from "../tableComponent/ColumnsButton";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function ParentDataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {

  return (
    <div className="flex gap-2 w-full md:w-auto relative">
      <ColumnsButton table={table} />
    </div>
  );
}
