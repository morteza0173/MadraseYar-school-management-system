import { AdminContent } from "@/components/AdminContent";
import { Suspense } from "react";


const AdminPage = () => {
  return (
    <Suspense fallback={<div>Loading admin data...</div>}>
      <AdminContent />
    </Suspense>
  );
};

export default AdminPage;
