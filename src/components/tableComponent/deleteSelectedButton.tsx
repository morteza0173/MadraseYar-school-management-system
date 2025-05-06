import { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  openDelete?: () => void;
}

export function DeleteSelectedButton<TData>({
  table,
  openDelete,
}: DataTableToolbarProps<TData>) {
  return (
    <>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button variant="outline" size="sm" onClick={openDelete}>
          <TrashIcon className="ml-2 size-4" aria-hidden="true" />
          حذف کردن ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      ) : null}
    </>
  );
}
export default DeleteSelectedButton;
