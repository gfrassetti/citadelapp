"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthHeader from "@/components/AuthHeader";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [queryClient] = useState(() => new QueryClient())

  const layouts = {
    "/": { header: <Header />, footer: <Footer /> },
    "/login": { header: <AuthHeader />, footer: <Footer /> },
    "/register": { header: <AuthHeader />, footer: <Footer /> },
    "/dashboard": { header: null, footer: null },
  };

  const { header, footer } = layouts[pathname] || { header: <Header />, footer: <Footer /> };

  return (
    <QueryClientProvider client={queryClient}>
    <html lang="en">
      <body className="antialiased flex flex-col justify-center items-center w-full">
        <ThemeProvider>
          <AuthProvider>
            {header}
            {children}
            {footer}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
    </QueryClientProvider>
  );
}
