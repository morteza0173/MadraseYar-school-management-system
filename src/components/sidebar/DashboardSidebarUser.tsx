"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getUserInfoProps } from "@/actions/dashboardAction";
import { Skeleton } from "../ui/skeleton";
import { logout } from "@/actions/loginAction";

export function DashboardSidebarUser({
  user,
  isUserPending,
}: {
  user: getUserInfoProps | undefined;
  isUserPending: boolean;
}) {
  const { isMobile } = useSidebar();

  const handleLogout = async () => {
    logout();
  };

  if (isUserPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex gap-2 p-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="grid flex-1">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-4" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!user) {
    return;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-orange-50 data-[state=open]:bg-orange-100"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user.img ? (
                  <AvatarImage src={user.img} alt={user.name} />
                ) : (
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-right text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-right text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.img ? (
                    <AvatarImage src={user.img} alt={user.name} />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="focus:bg-orange-50">
                <BadgeCheck />
                تنظیمات حساب
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-orange-50">
                <Bell />
                پیام ها
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="focus:bg-orange-50 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut />
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
