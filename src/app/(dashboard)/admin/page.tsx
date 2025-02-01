import { AdminContent } from "@/components/AdminContent";
import { AdminDashboardSkeleton } from "@/components/skeleton/AdminDashboardSkeleton";
import { Suspense } from "react";

const AdminPage = () => {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminContent />
    </Suspense>
  );
};

export default AdminPage;
