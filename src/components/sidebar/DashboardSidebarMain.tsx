"use client";

import {
  Calendar,
  ChevronLeft,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { getUserInfoProps } from "@/actions/dashboardAction";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

export function DashboardSidebarMain({
  items,
  userInfo,
  isUserPending,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    visible: string[];
    items?: {
      title: string;
      url: string;
      disabled?: boolean;
      visible: string[];
    }[];
  }[];
  userInfo: getUserInfoProps | undefined;
  isUserPending: boolean;
}) {
  const pathname = usePathname();

  if (isUserPending) {
    return (
      <div className="flex flex-col space-y-4 p-2">
        <Skeleton className="h-4 w-8 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>منو</SidebarGroupLabel>
      <SidebarMenu>
        {userInfo?.role && (
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname.includes(userInfo?.role)}
              className="data-[active=true]:bg-orange-100 hover:bg-orange-50"
              asChild
            >
              <Link href={`/${userInfo?.role}`}>
                <LayoutDashboard />
                <span>داشبورد </span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton
              isActive={pathname.includes("eventCalendar")}
              className="data-[active=true]:bg-orange-100 hover:bg-orange-50"
              asChild
            >
              <Link href="/eventCalendar">
                <Calendar />
                <span>تقویم رویدادها</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        {items.map((item) => {
          if (userInfo?.role) {
            if (item.visible.includes(userInfo.role)) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="data-[active=true]:bg-orange-100 hover:bg-orange-50 data-[state=open]:hover:bg-orange-50 active:bg-orange-100"
                      >
                        <ChevronLeft className="transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
                        <span>{item.title}</span>
                        {item.icon && <item.icon className="mr-auto" />}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="border-l-0 border-r border-orange-200 shadow-[inset_-1px_0_0_0_#fed7aa]">
                        {item.items?.map((subItem) => {
                          if (userInfo?.role) {
                            if (subItem.visible.includes(userInfo.role)) {
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    aria-disabled={subItem.disabled}
                                    isActive={pathname === subItem.url}
                                    className="data-[active=true]:bg-orange-100 hover:bg-orange-50 data-[state=open]:hover:bg-orange-50 active:bg-orange-100 w-full"
                                  >
                                    <Link href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            }
                          }
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
