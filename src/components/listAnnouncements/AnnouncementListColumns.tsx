"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { AnnouncementDataTableRowActions } from "./AnnouncementDataTableRowActions";
import { Badge } from "../ui/badge";
import { AnnouncementDataListSchema } from "@/lib/schemas";
import { DataTableColumnHeader } from "../tableComponent/data-table-column-header";

export const AnnouncementListColumns: ColumnDef<AnnouncementDataListSchema>[] = [
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
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تاریخ" />
    ),
    cell: ({ row }) => {
      const date: Date = row.getValue("date");

      // استخراج ساعت و تاریخ به صورت جداگانه
      const time = new Date(date).toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Tehran",
      });

      const fullDate = new Date(date).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Tehran",
      });

      // ترکیب ساعت و تاریخ به ترتیب دلخواه
      const formattedDate = `${time} - ${fullDate}`;

      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium capitalize">
            {formattedDate}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <AnnouncementDataTableRowActions row={row} />,
  },
];
