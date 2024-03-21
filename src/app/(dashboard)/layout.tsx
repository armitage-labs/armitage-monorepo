import "../globals.css";
import Header from "@/components/navigation/header";
import Sidebar from "@/components/navigation/sidebar";
import { SessionRefreshProvider } from "../providers/sessionRefreshProvider";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Header />
      <div className="flex h-screen">
        <SessionRefreshProvider>
          <Sidebar />
          <main className="w-full pt-16">{children}</main>
        </SessionRefreshProvider>
      </div>
    </html>
  );
}
