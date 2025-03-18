import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "./QueryProvider";

// const vazirmatn = Vazirmatn({ style: "normal", subsets: ["latin"] });

const yekanBakh = localFont({
  src: "./fonts/YekanBakh-Regular.woff2",
  variable: "--font-yekan-bakh",
  weight: "400",
});
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "MadraseYar",
  description: "MadraseYar is a school maneger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl">
      <body className={`${yekanBakh.className} antialiased`}>
        <QueryProvider>
          {children}
          <Toaster closeButton richColors dir="rtl" position="bottom-left" />
        </QueryProvider>
      </body>
    </html>
  );
}
