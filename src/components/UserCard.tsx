import { Ellipsis, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

const UserCard = ({
  type,
  Number,
  pending,
  icon,
}: {
  type: string;
  Number?: number;
  pending: boolean;
  icon: JSX.Element;
}) => {
  return (
    <div className="rounded-2xl odd:bg-sky-200/70 even:bg-orange-200 p-4 flex-1 min-w-[170px] shadow-sm w-full h-full">
      <div>
        <div className="flex items-center justify-between">
          {icon}
          <div>
            <Button
              variant="outline"
              size="icon"
              className="w-6 h-6 bg-transparent border-none shadow-none"
            >
              <Ellipsis className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {pending ? (
          <div className="flex justify-between items-center">
            <h2 className="font-semibold my-4 text-2xl text-gray-400 animate-bounce">
              0
            </h2>
            <Loader2 className="size-4 text-gray-400 animate-spin" />
          </div>
        ) : (
          <h2 className="font-semibold my-4 text-2xl">{Number}</h2>
        )}
        <h3 className="font-bold text-gray-700 text-sm">{type}</h3>
      </div>
    </div>
  );
};
export default UserCard;
