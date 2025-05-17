"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentDataTableRowActions } from "./StudentDataTableRowActions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { StudentDataListSchema } from "@/lib/schemas";
import { DataTableColumnHeader } from "../tableComponent/data-table-column-header";

interface Label {
  name: string;
  email: string;
  img: string;
}

interface cls {
  name: string;
  id: number;
}

export const StudentListColumns: ColumnDef<StudentDataListSchema>[] = [
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
      <DataTableColumnHeader column={column} title="مشخصات" />
    ),
    cell: ({ row }) => (
      <div className="md:w-auto capitalize  flex gap-2 items-center">
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
            {row.original.sex === "MALE" ? "پسر" : "دختر"}
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
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="شماره تماس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium capitalize">
            {row.getValue("phone") ? row.getValue("phone") : "ندارد"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "parent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نام پدر" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="capitalize"> {row.original.parent.name}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "class",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="کلاس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex xl:w-full items-center gap-1 flex-wrap">
          <Badge variant="outline" className="capitalize text-xs">
            {(row.getValue("class") as cls).name}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const className = (row.getValue(id) as cls).name;
      return value.includes(className);
    },
  },
  {
    accessorKey: "upcomingAssignments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تکالیف پیش رو" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span
            className={cn(
              "capitalize",
              Number(row.getValue("upcomingAssignments")) >= 0
                ? "text-green-500"
                : Number(row.getValue("upcomingAssignments")) > 5
                ? "text-orange-400"
                : "text-red-500"
            )}
          >
            {row.getValue("upcomingAssignments")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "upcomingExams",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="امتحانات پیش رو" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span
            className={cn(
              "capitalize",
              Number(row.getValue("upcomingExams")) >= 0
                ? "text-green-500"
                : Number(row.getValue("upcomingExams")) > 5
                ? "text-orange-400"
                : "text-red-500"
            )}
          >
            {row.getValue("upcomingExams")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "averageScore",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="میانگین نمرات" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span
            className={cn(
              "capitalize",
              row.original.averageScore
                ? Number(row.getValue("averageScore")) >= 17
                  ? "text-green-500"
                  : Number(row.getValue("averageScore")) > 12
                  ? "text-orange-400"
                  : "text-red-500"
                : "text-gray-400"
            )}
          >
            {row.getValue("averageScore")
              ? (row.getValue("averageScore") as number).toFixed(2)
              : "ندارد"}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="آدرس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium capitalize">
            {row.getValue("address")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <StudentDataTableRowActions row={row} />,
  },
];
