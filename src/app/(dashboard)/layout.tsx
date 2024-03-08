import "../globals.css";
import Header from "@/components/navigation/header";
import Sidebar from "@/components/navigation/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Header />
      <div className="flex h-screen">
        <Sidebar />
        <main className="w-full pt-16">{children}</main>
      </div>
    </html>
  );
}
