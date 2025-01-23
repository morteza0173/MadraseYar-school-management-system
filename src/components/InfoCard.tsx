import { BookText, ClockAlert, NotebookPen, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const InfoCard = ({
  name,
  info,
  icon,
}: {
  name: string;
  info: string;
  icon: string;
}) => {
  return (
    <Card className="h-full bg-Purple hover:opacity-80 cursor-pointer">
      <CardContent className="p-0 h-full">
        <div className=" h-full">
          <div className="flex gap-2 items-center p-1 px-2 md:pr-4 lg:px-2">
            {icon === "Score" && (
              <NotebookPen className="size-4 text-gray-500" />
            )}
            {icon === "attendance" && (
              <ClockAlert className="size-4 text-gray-500" />
            )}
            {icon === "lastScore" && (
              <BookText className="size-4 text-gray-500" />
            )}
            {icon === "warning" && (
              <TriangleAlert className="size-4 text-gray-500" />
            )}
            <p className="font-bold text-xs md:text-[0.6rem] lg:text-xs text-gray-500">
              {name}
            </p>
          </div>
          <div className="flex justify-center">
            <p className="text-xs font-semibold p-2">{info}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default InfoCard;
