import {
  BookText,
  ClockAlert,
  Home,
  Loader,
  NotebookPen,
  TriangleAlert,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";

const InfoCard = ({
  name,
  info,
  icon,
  error,
}: {
  name: string;
  info: number | null;
  icon: string;
  error?: boolean;
}) => {
  return (
    <Card className="h-full bg-sky-100 hover:opacity-80 cursor-pointer">
      <CardContent className="p-0 h-full">
        <div className=" h-full">
          <div className="flex gap-2 items-center p-1 px-2 md:pr-4 lg:px-2">
            {icon === "Score" && (
              <NotebookPen className="size-4 text-gray-500" />
            )}
            {icon === "attendance" && (
              <ClockAlert className="size-4 text-gray-500" />
            )}
            {icon === "warning" && (
              <TriangleAlert className="size-4 text-gray-500" />
            )}
            {icon === "lastScore" && (
              <BookText className="size-4 text-gray-500" />
            )}
            {icon === "classCount" && <Home className="size-4 text-gray-500" />}
            <p className="font-bold text-xs md:text-[0.6rem] lg:text-xs text-gray-500">
              {name}
            </p>
          </div>
          <div className="flex justify-center">
            {error ? (
              "error"
            ) : info === null ? (
              <Loader className="animate-spin w-4 h-4 m-2" />
            ) : (
              <p className="text-xs font-semibold p-2">{info}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default InfoCard;
