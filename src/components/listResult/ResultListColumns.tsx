"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { ResultDataListSchema } from "@/lib/schemas";
import { DataTableColumnHeader } from "../tableComponent/data-table-column-header";
import { FlaskConical, NotebookPen } from "lucide-react";
import Link from "next/link";

type student = {
  id: string;
  name: string;
  classId: number | undefined;
  className: string;
};

export const ResultListColumns: ColumnDef<ResultDataListSchema>[] = [
  {
    accessorKey: "student",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نام دانش‌آموز" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{(row.getValue("student") as student).name}</span>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      const labelName = (row.getValue(id) as { name: string }).name;
      return labelName.toLowerCase().includes(value.toLowerCase());
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
    accessorKey: "score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نمره" />
    ),
    cell: ({ row }) => {
      const score = row.getValue("score") as number;

      let textColor = "text-green-500";
      if (score >= 12 && score < 17) {
        textColor = "text-orange-500";
      } else if (score >= 10 && score < 12) {
        textColor = "text-yellow-800";
      } else if (score < 10) {
        textColor = "text-red-500";
      }

      return (
        <div className={`flex items-center gap-2 ${textColor}`}>
          <span>{score}</span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تاریخ ثبت" />
    ),
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");

      const formattedDate = new Date(date).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "long",
        timeZone: "Asia/Tehran",
      });

      return (
        <div className="flex items-center gap-2">
          <span>{formattedDate}</span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نوع" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;

      let badgeColor = "bg-blue-500 text-white";
      let icon = <NotebookPen className="w-4 h-4" />;

      if (type === "تکلیف") {
        badgeColor = "bg-green-500 text-white";
        icon = <FlaskConical className="w-4 h-4" />;
      }

      return (
        <div className="flex items-center gap-2">
          <Badge className={`${badgeColor}`}>
            <Link
              href={`/list/result/${row.original.type}/${row.original.relatedId}`}
              className="capitalize text-xs flex gap-1"
              onClick={() => {
                sessionStorage.setItem(
                  "previousPath",
                  window.location.pathname
                );
              }}
            >
              {icon}
              {type}
            </Link>
          </Badge>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <ResultDataTableRowActions row={row} />,
  // },
];
