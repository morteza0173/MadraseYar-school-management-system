import { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Table } from "@tanstack/react-table";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  column: string;
  title: string;
  filterValue: string;
}

export function DataFilterToggle<TData>({
  table,
  column,
  title,
  filterValue,
}: DataTableToolbarProps<TData>) {
  const [showUpcomingEvents, setShowUpcomingEvents] = useState(true);
  const columnFilters = table.getState().columnFilters;

  const prevFilterValueRef = useRef<typeof filterValue | undefined | unknown>(
    undefined
  );
  const mountedRef = useRef(false);
  useEffect(() => {
    table.getColumn(column)?.setFilterValue(filterValue);
  }, [table, column, filterValue]);

  useEffect(() => {
    const currentFilterValue = table.getColumn(column)?.getFilterValue();

    if (mountedRef.current) {
      const prev = prevFilterValueRef.current;

      if (prev === filterValue && !currentFilterValue) {
        setShowUpcomingEvents(false);
      }
    } else {
      mountedRef.current = true;
    }

    prevFilterValueRef.current = currentFilterValue;
  }, [columnFilters, table, column, filterValue]);

  const handleUpcomingEventsFilter = (checked: boolean) => {
    if (checked) {
      table.getColumn(column)?.setFilterValue(filterValue);
    } else {
      table.getColumn(column)?.setFilterValue(undefined);
    }
  };
  return (
    <>
      {table.getColumn(column) && (
        <div className="flex items-center gap-2">
          <Label htmlFor="upcoming-events" className="text-sm">
            {title}
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
    </>
  );
}
export default DataFilterToggle;
