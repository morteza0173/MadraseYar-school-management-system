import { ArrowDown, Ellipsis, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

const UserCard = ({
  type,
  Number,
  pending,
}: {
  type: string;
  Number?: number;
  pending: boolean;
}) => {
  return (
    <div className="rounded-2xl odd:bg-Purple even:bg-Yellow p-4 flex-1 min-w-[170px] shadow-sm w-full h-full">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center bg-white p-1 px-2 rounded-full">
            <ArrowDown className="w-2 h-2 text-rose-600" />
            <span className="text-[0.5rem] text-rose-600">13%</span>
          </div>
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
