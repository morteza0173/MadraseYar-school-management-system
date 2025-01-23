
import Navbar from "@/components/navbar/Navbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <SidebarProvider>
        {/* SIDEBAR */}
        <Suspense fallback={<div>Loading sidebar...</div>}>
          <Sidebar />
        </Suspense>
        <SidebarInset className="overflow-hidden">
          <main className="bg-[#F7F8FA] w-full max-w-full h-full">
            <Suspense fallback={<div>Loading Navbar...</div>}>
              <Navbar />
            </Suspense>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
export default DashboardLayout;
