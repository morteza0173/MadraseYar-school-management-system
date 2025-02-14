"use client";
import { Search } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUserAuth } from "@/hooks/useUserAuth";
import { Skeleton } from "../ui/skeleton";

const Navbar = () => {
  const { isUserPending, userData } = useUserAuth([
    "admin",
    "teacher",
    "student",
    "parent",
  ]);

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-200 px-2 bg-white">
          <Search className="w-4 h-4" />
          <input
            type="text"
            placeholder="جستجو ..."
            className="w-[100px] md:w-[200px]  p-2 bg-transparent outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-2">
          {isUserPending ? (
            <Skeleton className="h-3 w-16" />
          ) : (
            <span className="text-xs font-medium">{userData?.name}</span>
          )}
          {isUserPending ? (
            <Skeleton className="h-2 w-10" />
          ) : (
            <span className="text-[10px] text-right text-gray-500">
              {userData?.role}
            </span>
          )}
        </div>
        {isUserPending ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : userData?.img ? (
          <Avatar>
            <AvatarImage src={userData?.img} />
          </Avatar>
        ) : (
          <Avatar>
            <AvatarFallback>{userData?.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};
export default Navbar;
