"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../tableComponent/data-table-column-header";
import { Expense } from "./schema";
import { DataTableRowActions } from "./data-table-row-actions";



export const columns: ColumnDef<Expense>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="سال تحصیلی" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize  flex gap-2 items-center">
        <span className="max-w-[500px] truncate font-medium capitalize">
          {row.getValue("level")}
        </span>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      // اینجا فیلتر برای `label.name` تعریف می‌شود
      const labelName = (row.getValue(id) as { name: string }).name;
      return labelName.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "students",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تعداد دانش آموزان" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("students")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "classes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تعداد کلاس ها" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("classes")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
