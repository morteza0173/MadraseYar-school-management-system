import Navbar from "@/components/navbar/Navbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <SidebarProvider>
        {/* SIDEBAR */}

        <Sidebar />

        <SidebarInset className="overflow-hidden">
          <main className="bg-[#F7F8FA] w-full max-w-full h-full">
            <Navbar />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
export default DashboardLayout;
