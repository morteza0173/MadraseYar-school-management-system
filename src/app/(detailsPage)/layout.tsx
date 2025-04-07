import NavbarDetailpage from "./_component/navbar/navbarDetailpage";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full bg-[#F7F8FA] min-h-screen">
      <main className="max-w-7xl w-full h-full flex flex-col gap-4 p-1 md:p-4 lg:p-8 mx-auto">
        <NavbarDetailpage />
        {children}
      </main>
    </div>
  );
};
export default DashboardLayout;
