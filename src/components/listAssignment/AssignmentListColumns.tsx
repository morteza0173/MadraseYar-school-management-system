"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "../ui/badge";
import { AssignmentDataListSchema } from "@/lib/schemas";
import { DataTableColumnHeader } from "../tableComponent/data-table-column-header";
import { ExamDataTableRowActions } from "./AssignmentDataTableRowActions";

export const AssignmentListColumns: ColumnDef<AssignmentDataListSchema>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="عنوان" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] md:w-auto capitalize  flex gap-2 items-center">
        <div>
          <p>{row.getValue("title")}</p>
        </div>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      const title = row.getValue(id) as string;
      return title.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "lessonName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نام درس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex xl:w-full items-center gap-1 flex-wrap">
          <Badge variant="outline" className="capitalize text-xs">
            {row.getValue("lessonName")}
          </Badge>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      const lessonName = row.getValue("lessonName");
      return value.includes(lessonName);
    },
  },
  {
    accessorKey: "className",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="کلاس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex xl:w-full items-center gap-1 flex-wrap">
          <Badge variant="outline" className="capitalize text-xs">
            {row.getValue("className")}
          </Badge>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      const className = row.getValue("className");
      return value.includes(className);
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تاریخ تحویل" />
    ),
    cell: ({ row }) => {
      const date: Date = row.getValue("dueDate");

      const fullDate = new Date(date).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "long",
        timeZone: "Asia/Tehran",
      });

      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium capitalize">{fullDate}</span>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      const rowDate = new Date(row.getValue("dueDate"));
      const today = new Date();

      if (value === "upcoming") {
        return rowDate > today;
      }

      return true;
    },
  },
  {
    accessorKey: "remainingTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="فرصت باقی‌مانده" />
    ),
    cell: ({ row }) => {
      const date: Date = row.getValue("dueDate");
      const today = new Date();

      const timeDiff = new Date(date).getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));


      const message =
        daysRemaining > 0
          ? `${daysRemaining} روز باقی‌مانده`
          : daysRemaining === 0
          ? "امروز"
          : "گذشته است";

      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium capitalize">{message}</span>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      const rowDate = new Date(row.getValue("dueDate"));
      const today = new Date();


      if (value === "upcoming") {
        return rowDate > today;
      }

      return true;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ExamDataTableRowActions row={row} />,
  },
];
