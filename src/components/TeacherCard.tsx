import {
  BookOpenText,
  CalendarDays,
  CircleUser,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";

const TeacherCard = () => {
  return (
    <div className="bg-Sky w-full rounded-xl shadow-sm border border-gray-300 p-2">
      <div className="flex gap-4 items-center justify-start h-full">
        <Avatar className="w-28 h-28">
          <AvatarImage src="/teacher1.jpg" alt="teacher photo" />
        </Avatar>
        <div className="flex flex-col gap-2 font-bold w-full">
          <div className="flex justify-between items-center">
            <p>نازنین خوئینی</p>
            <div className="flex gap-1">
              <Edit className="size-4 text-gray-500 ml-2 cursor-pointer" />
              <Trash2 className="size-4 text-gray-500 cursor-pointer" />
            </div>
          </div>

          <p className="text-[0.5rem] md:text-[0.6rem] text-gray-600 w-full">
            اینجا هستم تا به شما کمک کنم بهترین نسخه از خودتان باشید. بیایید با
            هم یاد بگیریم و رشد کنیم.
          </p>
          <div className="mt-2 flex  w-full">
            <div className="flex gap-1 items-center w-1/2">
              <BookOpenText className="size-4" />
              <p className="text-[0.6rem] font-semibold">
                شماره تماس : 0930000000
              </p>
            </div>
            <div className="flex gap-1 items-center w-1/2">
              <CalendarDays className="size-4" />
              <p className="text-[0.6rem] font-semibold">
                {" "}
                ایمیل : teacher@gmail.com
              </p>
            </div>
          </div>
          <div className="flex  w-full">
            <div className="flex gap-1 items-center w-1/2">
              <CircleUser className="size-4" />
              <p className="text-[0.6rem] font-semibold">کلاس برتر : 11B</p>
            </div>
            <div className="flex gap-1 items-center w-1/2">
              <User className="size-4" />
              <p className="text-[0.6rem] font-semibold">جنسیت : زن</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TeacherCard;
