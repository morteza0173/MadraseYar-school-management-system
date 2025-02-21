"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { TeacherDataTableRowActions } from "./TeacherDataTableRowActions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { TeacherDataListSchema } from "@/lib/schemas";
import { DataTableColumnHeader } from "../tableComponent/data-table-column-header";

interface Label {
  name: string;
  email: string;
  img: string;
}

export const TeacherListColumns: ColumnDef<TeacherDataListSchema>[] = [
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
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="شماره تماس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("phone")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="حوزه تدریس" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("subject")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "classes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="کلاس ها" />
    ),
    cell: ({ row }) => {
      const classesValue = row.getValue("classes");
      const classesArray =
        typeof classesValue === "string"
          ? classesValue.split(",").map((cls: string) => cls.trim())
          : [];
      return (
        <div className="flex w-[150px] lg:w-[250px] xl:w-full items-center gap-1 flex-wrap">
          {classesArray.map((cls, index) => (
            <Badge key={index} variant="outline" className="capitalize text-xs">
              {cls}
            </Badge>
          ))}
        </div>
      );
    },
    filterFn: (row, id, filterValues) => {
      const classesValue = row.getValue(id);
      if (typeof classesValue !== "string") return false;
      const classesArray = classesValue
        .split(",")
        .map((cls: string) => cls.trim());
      return classesArray.some((cls) => filterValues.includes(cls));
    },
  },
  {
    accessorKey: "eventOnGoing",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="رویداد های پیش رو" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span
            className={cn(
              "capitalize",
              Number(row.getValue("eventOnGoing")) >= 0
                ? "text-green-500"
                : Number(row.getValue("eventOnGoing")) > 5
                ? "text-orange-400"
                : "text-red-500"
            )}
          >
            {row.getValue("eventOnGoing")}
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
    cell: ({ row }) => <TeacherDataTableRowActions row={row} />,
  },
];
