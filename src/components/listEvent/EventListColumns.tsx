"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { EventDataTableRowActions } from "./EventDataTableRowActions";
import { Badge } from "../ui/badge";
import { EventDataListSchema } from "@/lib/schemas";
import { DataTableColumnHeader } from "../tableComponent/data-table-column-header";

export const EventListColumns: ColumnDef<EventDataListSchema>[] = [
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
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="توضیحات" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 max-w-[200px] md:w-auto">
          <span className="font-medium capitalize">
            {row.getValue("description")}
          </span>
        </div>
      );
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
    accessorKey: "startTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تاریخ" />
    ),
    cell: ({ row }) => {
      const date: Date = row.getValue("startTime");

      const fullDate = new Date(date).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Tehran",
      });

      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium capitalize">{fullDate}</span>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      const rowDate = new Date(row.getValue("startTime"));
      const today = new Date();

      // مقایسه تاریخ ردیف با تاریخ امروز
      if (value === "upcoming") {
        return rowDate > today; // فقط تاریخ‌های آینده
      }

      return true; // اگر فیلتر فعال نباشد، همه ردیف‌ها را نشان بده
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <EventDataTableRowActions row={row} />,
  },
];
