import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { getRelativeTime } from "@/lib/getRelativeTime";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface AnnouncementsProps {
  id: number;
  title: string;
  date: Date;
  description: string;
  className: string;
}

export const Announcements = ({
  announcementsData = [],
  isAnnouncementsPending,
}: {
  announcementsData: AnnouncementsProps[] | undefined;
  isAnnouncementsPending: boolean;
}) => {
  const limitedAnnouncements = announcementsData?.slice(0, 6); // محدود کردن به 6 اعلامیه

  return (
    <Card>
      <CardContent className="px-0">
        <div className="flex items-center justify-between pt-4 px-4">
          <p className="text-sm md:text-base font-bold">آخرین اعلامیه ها</p>
          <Link href="/list/announcement">
            <Button
              variant="outline"
              size="sm"
              className="h-6 bg-transparent border-none shadow-none"
            >
              <p className="text-xs font-bold">مشاهده ی همه</p>
            </Button>
          </Link>
        </div>
        {isAnnouncementsPending ? (
          <div className="flex gap-2 items-center justify-center h-[300px]">
            <Loader2 className="animate-spin w-4 h-4 " />
            <p className="text-xs text-gray-400">درحال دریافت اعلامیه ها</p>
          </div>
        ) : limitedAnnouncements?.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-xs text-gray-400">هیچ اعلامیه ای وجود ندارد</p>
          </div>
        ) : (
          <div className="w-full h-[300px] overflow-y-scroll custom-scrollbar mt-4">
            {limitedAnnouncements.map((announcement, index) => {
              return (
                <AnnounceList
                  key={index}
                  title={announcement.title}
                  date={announcement.date}
                  description={announcement.description}
                  className={announcement.className}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AnnounceList = ({
  title,
  date,
  description,
  className,
}: {
  title: string;
  date: Date;
  description: string;
  className: string;
}) => {
  return (
    <div className="w-[94%] h-auto odd:bg-orange-200 even:bg-sky-200/70 rounded-sm mt-2 p-2 mr-2">
      <div className="flex flex-col gap-2 w-auto">
        <div className="flex justify-between items-center">
          <p className="text-xs">{className}</p>

          <Badge variant="secondary">
            <p className="text-[10px] font-thin">{getRelativeTime(date)}</p>
          </Badge>
        </div>
        <Separator className="bg-gray-300" />

        <div className="flex items-center justify-between w-auto">
          <p className="text-xs">{title}</p>
        </div>

        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
};
