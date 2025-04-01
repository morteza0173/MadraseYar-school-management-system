"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon, X } from "lucide-react";
import { DataTableFacetedFilter } from "../tableComponent/data-table-faceted-filter";
import { useUserAuth } from "@/hooks/useUserAuth";
import useGetClassDetails from "@/hooks/useGetClassDetails";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import ResponsiveModalForm from "../ResponsiveModalForm";
import { AssignmentDataTableViewOptions } from "./AssignmentDataTableViewOptions";
import DeleteAssignmentsForm from "./DeleteAssignmentForm";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function AssignmentDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const closeDelete = () => setIsOpenDelete(false);
  const openDelete = () => setIsOpenDelete(true);

  const isFiltered = table.getState().columnFilters.length > 0;

  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const { ClassData } = useGetClassDetails(userData);

  const className = ClassData?.map((Class) => ({
    value: Class?.name,
    label: Class?.name,
  }));

  const [showUpcomingEvents, setShowUpcomingEvents] = useState(true);

  useEffect(() => {
    table.getColumn("dueDate")?.setFilterValue("upcoming"); // فعال کردن فیلتر
  }, [table]);

  const handleUpcomingEventsFilter = (checked: boolean) => {
    if (checked) {
      table.getColumn("dueDate")?.setFilterValue("upcoming"); // فعال کردن فیلتر
    } else {
      table.getColumn("dueDate")?.setFilterValue(undefined); // حذف فیلتر
    }
  };

  const selectedIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => (row.original as { id: number }).id);

  return (
    <>
      <ResponsiveModalForm
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        close={closeDelete}
        title="حذف امتحان‌های انتخاب شده"
        discription="میتوانید به صورت یکجا امتحان‌های انتخاب شده را حذف کنید"
      >
        <DeleteAssignmentsForm onCancel={closeDelete} ids={selectedIds} />
      </ResponsiveModalForm>
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex w-full md:w-auto flex-wrap items-center gap-2 flex-col md:flex-row">
          <Input
            placeholder="جستجو بر اساس عنوان"
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("title")?.setFilterValue(event.target.value);
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

          {table.getColumn("dueDate") && (
            <div className="flex items-center gap-2">
              <Label htmlFor="upcoming-events" className="text-sm">
                فقط تکالیف پیش‌رو
              </Label>
              <Input
                type="checkbox"
                id="upcoming-events"
                checked={showUpcomingEvents}
                onChange={(e) => {
                  setShowUpcomingEvents(e.target.checked);
                  handleUpcomingEventsFilter(e.target.checked);
                }}
                className="h-4 w-4"
              />
            </div>
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters();
                setShowUpcomingEvents(false);
              }}
              className="h-8 px-2 lg:px-3"
            >
              ریست
              <X className="mr-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <Button variant="outline" size="sm" onClick={openDelete}>
              <TrashIcon className="ml-2 size-4" aria-hidden="true" />
              حذف کردن ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          ) : null}
          <AssignmentDataTableViewOptions table={table} />
        </div>
      </div>
    </>
  );
}
