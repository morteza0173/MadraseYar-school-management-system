"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";

const SubmitButton = ({
  text = "ثبت",
  isPending,
  disabled,
}: {
  text?: string;
  isPending?: boolean;
  disabled?: boolean;
}) => {
  const { pending } = useFormStatus();
  const isLoading = isPending ?? pending;
  return (
    <Button
      className="w-full bg-orange-400 hover:bg-orange-300"
      disabled={isLoading || disabled}
      type="submit"
    >
      {isLoading ? (
        <>
          <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
          لطفا صبر کنید ...
        </>
      ) : (
        text
      )}
    </Button>
  );
};
export default SubmitButton;
