"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Expense } from "./schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Label {
  name: string;
  email: string;
  img: string;
}

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
    accessorKey: "label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نام" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize  flex gap-2 items-center">
        <div>
          {(row.getValue("label") as Label)?.img ? (
            <Avatar>
              <AvatarImage src={(row.getValue("label") as Label)?.img} />
            </Avatar>
          ) : (
            <Avatar>
              <AvatarFallback className="bg-gray-300">
                {(row.getValue("label") as Label)?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm">
            {(row.getValue("label") as Label)?.name}
          </div>
          <div className="text-xs  text-gray-400">
            {(row.getValue("label") as Label)?.email}
          </div>
        </div>
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
    accessorKey: "note",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="شماره تماس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("note")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="درس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("category")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="کلاس" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type");
      return (
        <div className="flex w-[100px] items-center">
          {type === "income" ? (
            <TrendingUp size={20} className="mr-2 text-green-500" />
          ) : (
            <TrendingDown size={20} className="mr-2 text-red-500" />
          )}
          <span className="capitalize"> {row.getValue("type")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="حضور" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span
            className={cn(
              "capitalize",
              Number(row.getValue("amount")) > 97
                ? "text-green-500"
                : Number(row.getValue("amount")) > 95 ? "text-orange-400" : "text-red-500"
            )}
          >
            {" "}
            {row.getValue("amount")} %
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="اخرین بروزرسانی" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formattedDate = date.toLocaleDateString("fa", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{formattedDate}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
