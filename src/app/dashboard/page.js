"use client";
import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/AppSidebar";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../../lib/db/db.js";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/AuthContext";
import UploadInfo from "@/components/UploadInfo";


export default function Dashboard() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, updateUserPlan } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState(null); // 🔥 Hook de estado agregado en orden correcto

  // ✅ Hook siempre fuera de condiciones
  const ref = useRef(null);

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (!firebaseUser) {
          router.push("/login");
        } else {
          setUser({ ...firebaseUser });
          setLoading(false);
        }
      });

      return () => unsubscribe();
    });
  }, [router]);

// 🔄 Sincroniza el plan del usuario desde Firestore
// Esta consulta asegura que el estado global del plan esté actualizado con la base de datos.
// Se ejecuta automáticamente al cargar el componente y se puede forzar con refetch().
// Es útil para reflejar cambios hechos fuera del flujo actual, como actualizaciones desde otro dispositivo.

  const { data: userData, refetch } = useQuery({
    queryKey: ["userPlan", user?.uid],
    queryFn: async () => {
      if (!user) throw new Error("Usuario no autenticado");

      const token = await user.getIdToken();
      const response = await fetch(`/api/get-user-plan?uid=${user.uid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        console.error("❌ Error en la respuesta:", await response.text());
        throw new Error("Error en la respuesta");
      }
      
      return response.json();
    },
    enabled: !!user,
    onSuccess: (data) => {
      updateUserPlan(data.plan); // ✅ Actualiza el plan en el contexto global
    },
  });

  useEffect(() => {
    if (user?.uid) {
      refetch(); // Fuerza a obtener el plan actualizado
    }
  }, [user?.uid]);
  

  const handleUpgrade = useMutation({
    mutationFn: async () => {
      if (!user?.uid || !user?.email) {
        throw new Error("Faltan datos del usuario");
      }
      setLoading(true);
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la respuesta: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.subscriptionUrl) {
        window.location.href = data.subscriptionUrl;
      }
    },
    onError: (error) => {
      console.error("❌ Error en la suscripción:", error);
    },
  });

  if (loading || !authUser?.plan) return <p>Cargando...</p>;

  return (
    <>
      <header className="w-full flex justify-between py-4">
        <div></div>
        <div className="flex flex-col-reverse welcome-content px-4">
          <button onClick={() => signOut(auth).then(() => router.push("/login"))}>
            Cerrar sesión
          </button>
          <h3 className="font-bold text-black">Plan:<span className="text-blue-400 font-bold">{authUser.plan}</span></h3>
          <h4>Bienvenido, {user.displayName || user.email}</h4>
        </div>
      </header>
      <SidebarProvider>
  <AppSidebar setActiveComponent={setActiveComponent} />
  <SidebarInset>
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    {activeComponent === "UploadInfo" && <UploadInfo />}
    {!activeComponent && (
    <>
      {authUser?.plan === "free" ? (
        <Card className="max-w-lg mx-auto p-6 text-center">
          <CardHeader>
            <CardTitle>Upgrade to Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Accede a todas las funciones premium.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleUpgrade.mutate()} className="w-full bg-blue-600">
              Upgrade Now
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <p>Bienvenido a tu cuenta PRO</p>
      )}
    </>
  )}
    </div>
  </SidebarInset>
</SidebarProvider>
    </>
  );
}
