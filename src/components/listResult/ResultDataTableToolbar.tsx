"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "../tableComponent/data-table-faceted-filter";
import { useUserAuth } from "@/hooks/useUserAuth";
import { ResultDataTableViewOptions } from "./ResultDataTableViewOptions";
import { useGetClassDetails } from "@/hooks/useGetClassDetails";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function ResultDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const { data: ClassData } = useGetClassDetails(userData);

  const className = ClassData?.map((Class) => ({
    value: Class?.name,
    label: Class?.name,
  }));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex w-full md:w-auto flex-wrap items-center gap-2 flex-col md:flex-row">
          <Input
            placeholder="جستجو بر اساس نام"
            value={
              (table.getColumn("student")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              table.getColumn("student")?.setFilterValue(event.target.value);
            }}
            className="h-8 w-full md:w-[150px] lg:w-[250px]"
          />

          {table.getColumn("className") && (
            <DataTableFacetedFilter
              column={table.getColumn("className")}
              title="کلاس"
              options={className || []}
            />
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters();
              }}
              className="h-8 px-2 lg:px-3"
            >
              ریست
              <X className="mr-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <ResultDataTableViewOptions table={table} />
        </div>
      </div>
    </>
  );
}
