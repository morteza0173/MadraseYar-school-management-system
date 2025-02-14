"use client";
import { useUserAuth } from "@/hooks/useUserAuth";
import { DashboardSidebar } from "./DashboardSidebar";

export function Sidebar() {
  const { userData, isUserPending } = useUserAuth([
    "admin",
    "teacher",
    "student",
    "parent",
  ]);

  return <DashboardSidebar userInfo={userData} isUserPending={isUserPending} />;
}
