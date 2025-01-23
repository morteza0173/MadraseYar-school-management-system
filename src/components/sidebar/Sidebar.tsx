import { getUserInfo } from "@/actions/dashboardAction";
import { DashboardSidebar } from "./DashboardSidebar";

export async function Sidebar() {
    const userinfo = await getUserInfo()

  return <DashboardSidebar userInfo={userinfo} />;
}
