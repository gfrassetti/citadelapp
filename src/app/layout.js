"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeProvider";
import { AuthProvider, useUser } from "@/context/AuthContext";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthHeader from "@/components/AuthHeader";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { UserDataProvider } from "@/context/UserDataContext";
import { Toaster } from "@/components/ui/sonner";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import FullScreenLoader from "@/components/FullScreenLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function LayoutContent({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const { loading, user } = useUser();
  
  const layouts = {
    "/": { header: <Header />, footer: <Footer /> },
    "/login": { header: <AuthHeader />, footer: <Footer /> },
    "/register": { header: <AuthHeader />, footer: <Footer /> },
    "/product": { header: <Header />, footer: <Footer /> },
    "/company": { header: <Header />, footer: <Footer /> },
  };

/*   if (isDashboard && (loading || !user || !user.plan)) {
    return <FullScreenLoader />;
  } */
    if (isDashboard) {
      if (loading) {
        return <FullScreenLoader />;
      }

      if (!user) {
        if (typeof window !== 'undefined') {
          window.location.href = "/login"; // redirección real, no reactiva
        }
        return null;
      }
    }
    
  const { header, footer } = isDashboard
    ? { header: null, footer: null }
    : layouts[pathname] || { header: <Header />, footer: <Footer /> };

  return (
    <>
      {header}
      <main className="flex-1 w-full mx-auto">{children}</main>
      <Toaster />
      {footer}
    </>
  );
}

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="min-h-screen flex flex-col">
          <ThemeProvider>
            <AuthProvider>
              <UserDataProvider>
                <SubscriptionProvider>
                  <LayoutContent>{children}</LayoutContent>
                </SubscriptionProvider>
              </UserDataProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </QueryClientProvider>
  );
}
