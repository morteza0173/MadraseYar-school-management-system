import { Search } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getUserInfo } from "@/actions/dashboardAction";
import { redirect } from "next/navigation";

const Navbar = async () => {
  const userinfo = await getUserInfo();
  if (!userinfo) {
    redirect("/login");
  }

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
        <div className="flex flex-col">
          <span className="text-xs font-medium">{userinfo.name}</span>
          <span className="text-[10px] text-right text-gray-500">
            {userinfo.role}
          </span>
        </div>
        {userinfo.img ? (
          <Avatar>
            <AvatarImage src={userinfo.img} />
          </Avatar>
        ) : (
          <Avatar>
            <AvatarFallback>{userinfo.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};
export default Navbar;
