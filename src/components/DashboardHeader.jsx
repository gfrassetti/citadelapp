"use client";
import { useUser } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/db/db";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";


export default function DashboardHeader() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <header className="flex items-center justify-between sm:justify-end px-4 py-3 border-b">
       <SidebarTrigger className="inline sm:hidden" />
      <div className="flex items-center gap-2">
        <span>
          Bienvenido,{" "}
          <span className="text-blue-600 font-bold">
            {user?.name || user?.displayName || user?.email}
          </span>
        </span>
        <Badge className="bg-gray-700 ml-1 text-white">
          {user?.plan}
        </Badge>
        <button
          className="italic ml-4"
          onClick={() => signOut(auth).then(() => router.push("/login"))}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
