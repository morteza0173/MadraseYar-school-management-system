"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { TrashIcon, X } from "lucide-react";
import { DataTableFacetedFilter } from "../listTeacher/data-table-faceted-filter";
import useGetSubjects from "@/hooks/useGetSubjects";
import { useUserAuth } from "@/hooks/useUserAuth";
import useGetClassDetails from "@/hooks/useGetClassDetails";
import { LessonsListDataTableViewOptions } from "./LessonsListDataTableViewOptions";
import ResponsiveModalForm from "../ResponsiveModalForm";
import { useState } from "react";
import DeleteLessonsForm from "./DeleteLessonsForm";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function LessonsDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const { subjectData } = useGetSubjects(userData);
  const { ClassData } = useGetClassDetails(userData);

  const closeDelete = () => setIsOpenDelete(false);
  const openDelete = () => setIsOpenDelete(true);

  const subjectName = subjectData?.map((subject) => ({
    value: subject?.name,
    label: subject?.name,
  }));
  const className = ClassData?.map((Class) => ({
    value: Class?.name,
    label: Class?.name,
  }));

  const selectedIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => (row.original as { lessonId: number }).lessonId);

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
      <ResponsiveModalForm
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        close={closeDelete}
        title="حذف درس های انتخاب شده"
        discription="میتوانید با حذف کردن درس های انتخاب شده آنها را از برنامه هفتگی حذف کنید"
      >
        <DeleteLessonsForm onCancel={closeDelete} ids={selectedIds} />
      </ResponsiveModalForm>
      <div className="flex flex-wrap items-center justify-between w-full gap-2">
        <div className="flex w-full md:w-auto flex-wrap items-center gap-2 flex-col md:flex-row">
          <Input
            placeholder="جستجو ..."
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-full md:w-[150px] lg:w-[250px]"
          />
          {table.getColumn("subjectName") && (
            <DataTableFacetedFilter
              column={table.getColumn("subjectName")}
              title="حوزه تدریس"
              options={subjectName || []}
            />
          )}
          {table.getColumn("className") && (
            <DataTableFacetedFilter
              column={table.getColumn("className")}
              title="کلاس ها"
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

          <div className="flex items-center w-full md:w-auto md:mt-0">
            {table.getFilteredSelectedRowModel().rows.length > 0 ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={openDelete}
              >
                <TrashIcon className="ml-2 size-4" aria-hidden="true" />
                حذف کردن ({table.getFilteredSelectedRowModel().rows.length})
              </Button>
            ) : null}
          </div>
        </div>
        <LessonsListDataTableViewOptions table={table} />
      </div>
    </>
  );
}
