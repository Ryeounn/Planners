"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import Navbar from "./layout/navbar";
import Footer from "./layout/footer";
import SideBar from "./admin/layout/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import Script from 'next/script';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [admin, setAdmin] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminid = sessionStorage.getItem('admin');
      setAdmin(adminid);
    }
  }, []);

  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
        <Script src="https://www.paypal.com/sdk/js?client-id=AT2NUqw1ncYnTHFmrUYZImtzajR-BX0oexSz7wzjeBDK0v5Ek9F4C_ctjylLCE-Vp35cX36zMlBpEBRL" strategy="lazyOnload" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="h-full">
          {isAdminRoute ? (
            <div>
              <Toaster />
              <div className="flex">
                <div className="w-[250px]">
                  <SideBar />
                </div>
                <div className="w-[calc(100%-250px)] h-full bg-[#f5f5f5] pt-5">
                  {children}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Toaster />
              <Navbar />
              {children}
              <Footer />
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
