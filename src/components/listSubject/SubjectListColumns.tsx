"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tableComponent/data-table-column-header";

import { SubjectListDataTableRowActions } from "./SubjectListDataTableRowActions";
import { SubjectListSchema } from "@/lib/schemas";

export const SubjectListColumns: ColumnDef<SubjectListSchema>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نام حوزه تدریس" />
    ),
    cell: ({ row }) => (
      <div className="capitalize  flex gap-2 items-center">
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
    accessorKey: "teacherCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تعداد معلم ها" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("teacherCount")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "lessonCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تعداد دروس مرتبط" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("lessonCount")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <SubjectListDataTableRowActions row={row} />,
  },
];
