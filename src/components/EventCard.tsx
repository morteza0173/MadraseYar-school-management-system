import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

export const EventCard = () => {
  return (
    <Card>
      <CardContent className="px-0">
        <div className="flex items-center justify-between pt-4 px-4">
          <p className="text-sm md:text-base font-bold">رویداد های این تاریخ</p>
          <Button
            variant="outline"
            size="lg"
            className="h-6 bg-transparent border-none shadow-none"
            disabled
          >
            <p className="text-xs text-gray-400 font-bold">مشاهده ی همه</p>
          </Button>
        </div>
        <div className="w-full h-[300px] overflow-y-scroll custom-scrollbar mt-4">
          <EventList />
          <EventList />
          <EventList />
          <EventList />
          <EventList />
        </div>
      </CardContent>
    </Card>
  );
};

const EventList = () => {
  return (
    <div className="w-[94%] h-16 odd:bg-orange-200 even:bg-sky-200/70 rounded-lg mt-2 flex items-center p-2 mr-2">
      <p className="text-xs">9:00 صبح</p>
      <Separator
        orientation="vertical"
        className="w-1 rounded-full bg-white mr-2"
      />
      <div className="mr-4 flex flex-col gap-2">
        <p className="text-xs">امتحان ریاضی</p>
        <p className="text-xs text-gray-600">
          از صفحات 200 تا 245 امتحان تشریحی گرفته میشود
        </p>
      </div>
    </div>
  );
};
