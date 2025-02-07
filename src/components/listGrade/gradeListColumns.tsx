"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tableComponent/data-table-column-header";
import { GradeListDataTableRowActions } from "./GradeListDataTableRowActions";
import { GradeListSchema } from "@/lib/schemas";

export const gradeListColumns: ColumnDef<GradeListSchema>[] = [
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
    cell: ({ row }) => <GradeListDataTableRowActions row={row} />,
  },
];
