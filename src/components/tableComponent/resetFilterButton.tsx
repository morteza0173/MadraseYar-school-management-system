import { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function ResetFilterButton<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
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
    </>
  );
}
export default ResetFilterButton;
