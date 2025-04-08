"use client";

import { Calendar } from "@/components/ui/calendar";
import { Dispatch, SetStateAction } from "react";

interface DatePickerProps {
  daypickerValue: Date | undefined;
  setDaypickerValue: Dispatch<SetStateAction<Date | undefined>>;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  daypickerValue,
  setDaypickerValue,
}) => {
  return (
    <Calendar
      mode="single"
      selected={daypickerValue}
      onSelect={setDaypickerValue}
      className="rounded-md border"
    />
  );
};
