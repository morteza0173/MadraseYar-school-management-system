"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tableComponent/data-table-column-header";

import { Checkbox } from "../ui/checkbox";
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نام کلاس" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize  flex gap-2 items-center">
        <span className="max-w-[500px] truncate font-medium capitalize">
          {row.getValue("name")}
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
    accessorKey: "grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="سال تحصیلی" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("grade")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ظرفیت کلاس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("capacity")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "studentCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تعداد دانش آموزان کلاس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("studentCount")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "supervisor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="مشاور کلاس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("supervisor")}
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
