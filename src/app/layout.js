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
import { UserDataProvider } from "@/context/UserDataContext";

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
  const [queryClient] = useState(() => new QueryClient());

  const layouts = {
    "/": { header: <Header />, footer: <Footer /> },
    "/login": { header: <AuthHeader />, footer: <Footer /> },
    "/register": { header: <AuthHeader />, footer: <Footer /> },
    "/dashboard": { header: null, footer: null },
    "/product": { header: <Header />, footer:  <Footer /> },
    "/company": { header: <Header />, footer:  <Footer /> },
  };

  const { header, footer } = layouts[pathname] || {
    header: <Header />,
    footer: <Footer />,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="min-h-screen flex flex-col">
          <ThemeProvider>
            <AuthProvider>
              <UserDataProvider>
                {header}
                <main className="flex-1 w-full mx-auto">{children}</main>
                {footer}
              </UserDataProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </QueryClientProvider>
  );
}

