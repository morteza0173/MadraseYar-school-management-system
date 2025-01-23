import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export const Announcements = () => {
  return (
    <Card>
      <CardContent className="px-0">
        <div className="flex items-center justify-between pt-4 px-4">
          <p>آخرین اعلامیه ها</p>
          <Button
            variant="outline"
            size="lg"
            className="h-6 bg-transparent border-none shadow-none"
          >
            <p className="text-xs text-gray-400 font-bold">مشاهده ی همه</p>
          </Button>
        </div>
        <div className="w-full h-[300px] overflow-y-scroll custom-scrollbar mt-4">
          <AnnounceList />
          <AnnounceList />
          <AnnounceList />
          <AnnounceList />
          <AnnounceList />
        </div>
      </CardContent>
    </Card>
  );
};

const AnnounceList = () => {
  return (
    <div className="w-[94%] h-16 odd:bg-yellow-200 even:bg-sky-200 rounded-lg mt-2 p-2 mr-2">
      <div className="flex flex-col gap-2 w-auto">
        <div className="flex items-center justify-between w-auto">
          <p className="text-xs">امتحان ریاضی</p>
          <div className="py-1 px-2 bg-white rounded-full">
            <p className="text-[10px] text-green-400 font-bold">1403-10-30</p>
          </div>
        </div>

        <p className="text-xs text-gray-600">
          از صفحات 200 تا 245 امتحان تشریحی گرفته میشود
        </p>
      </div>
    </div>
  );
};
