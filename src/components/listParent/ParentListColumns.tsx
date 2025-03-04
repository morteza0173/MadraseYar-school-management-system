"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ParentDataTableRowActions } from "./ParentDataTableRowActions";
import { Badge } from "../ui/badge";
import { DataTableColumnHeader } from "../tableComponent/data-table-column-header";
import { ParentSingleType } from "@/actions/parentAction";

export const ParentListColumns: ColumnDef<ParentSingleType>[] = [
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
      <DataTableColumnHeader column={column} title="نام والد" />
    ),
    cell: ({ row }) => (
      <div className="md:w-auto capitalize  flex gap-2 items-center">
        <div>
          <p>
            {row.getValue("name")} {row.original.surname}
          </p>
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
    accessorKey: "students",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نام دانش آموز" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1 w-[100px] items-center">
          {row.original?.students.length > 0 ? (
            row.original?.students.map((student) => {
              return (
                <Badge
                  variant="secondary"
                  key={student?.id}
                >{`${student?.name} ${student.surname}`}</Badge>
              );
            })
          ) : (
            <p>ندارد</p>
          )}
          {}
        </div>
      );
    },
    filterFn: (row, _id, filterValue) => {
      if (!filterValue || filterValue.trim() === "") return true;

      return row.original.students.some((student) => {
        const fullName = `${student.name} ${student.surname}`.toLowerCase();

        return fullName.includes(filterValue.toLowerCase().trim());
      });
    },
  },
  {
    accessorKey: "classes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="کلاس ها" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col md:flex-row lg:w-[250px] xl:w-full items-center gap-1 flex-wrap">
          {row.original.students.length > 0 ? (
            row.original?.students.map((student) => {
              return (
                <Badge
                  variant="outline"
                  key={student?.class?.name}
                >{`${student?.class.name}`}</Badge>
              );
            })
          ) : (
            <p>ندارد</p>
          )}
        </div>
      );
    },
    filterFn: (row, _id, filterValues) => {
      if (
        !filterValues ||
        !Array.isArray(filterValues) ||
        filterValues.length === 0
      )
        return true;

      const selectedClasses = filterValues.map((cls: string) =>
        cls.toLowerCase()
      );

      return row.original.students.some((student) => {
        const className = student?.class?.name;
        return className && selectedClasses.includes(className.toLowerCase());
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ParentDataTableRowActions row={row} />,
  },
];
