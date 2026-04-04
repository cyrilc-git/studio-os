import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Studio OS — App Studio Autonome",
  description:
    "Radar → Signal → Dev → Maintenance → Growth. Le cockpit de ton app studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex">
        <Sidebar />
        <main className="flex-1 ml-[240px] min-h-screen">{children}</main>
      </body>
    </html>
  );
}
