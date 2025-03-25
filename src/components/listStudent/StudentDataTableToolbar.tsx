"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon, X } from "lucide-react";
import { StudentDataTableViewOptions } from "./StudentDataTableViewOptions";
import { DataTableFacetedFilter } from "../tableComponent/data-table-faceted-filter";
import { useUserAuth } from "@/hooks/useUserAuth";
import useGetClassDetails from "@/hooks/useGetClassDetails";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function StudentDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const { ClassData } = useGetClassDetails(userData);

  const className = ClassData?.map((Class) => ({
    value: Class?.name,
    label: Class?.name,
  }));

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex w-full md:w-auto flex-wrap items-center gap-2 flex-col md:flex-row">
        <Input
          placeholder="جستجو بر اساس نام"
          value={(table.getColumn("label")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("label")?.setFilterValue(event.target.value);
          }}
          className="h-8 w-full md:w-[150px] lg:w-[250px]"
        />
        {/* {table.getColumn("subject") && (
          <DataTableFacetedFilter
            column={table.getColumn("subject")}
            title="سال تحصیلی"
            options={subjectName || []}
          />
        )} */}
        {table.getColumn("class") && (
          <DataTableFacetedFilter
            column={table.getColumn("class")}
            title="کلاس"
            options={className || []}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            ریست
            <X className="mr-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Button variant="outline" size="sm">
            <TrashIcon className="ml-2 size-4" aria-hidden="true" />
            حذف کردن ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        ) : null}
        <StudentDataTableViewOptions table={table} />
      </div>
    </div>
  );
}
