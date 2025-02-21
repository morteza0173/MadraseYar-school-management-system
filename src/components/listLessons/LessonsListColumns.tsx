"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tableComponent/data-table-column-header";

import { LessonListDataTableRowActions } from "./LessonListDataTableRowActions";
import { LessonsListSchema } from "@/lib/schemas";
import { Checkbox } from "../ui/checkbox";

export const LessonListColumns: ColumnDef<LessonsListSchema>[] = [
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
    accessorKey: "lessonName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نام درس" />
    ),
    cell: ({ row }) => (
      <div className=" capitalize  flex gap-2 items-center">
        <span className="max-w-[500px] truncate font-medium capitalize">
          {row.getValue("lessonName")}
        </span>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true,
    filterFn: (row, id, value) => {
      // اینجا فیلتر برای `label.name` تعریف می‌شود
      const lessonName = row.getValue(id) as string;
      return lessonName.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "subjectName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="حوزه تدریس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-1">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("subjectName")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "day",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="روز" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-1">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("day")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ساعت شروع" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-1">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("startTime")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ساعت پایان" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-1">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("endTime")}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacher.name,
    id: "teacher",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="معلم" />
    ),
    cell: ({ row }) => {
      const teacher = row.original.teacher;
      return (
        <div className="flex space-x-1">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {teacher.name}
          </span>
        </div>
      );
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "className",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="کلاس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-1">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("className")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <LessonListDataTableRowActions row={row} />,
  },
];
