"use client";
import React, { useEffect, useState, useRef } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/AppSidebar";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/AuthContext";
import UploadInfo from "@/components/UploadInfo";
import UploadProduct from "@/components/UploadProduct";
import Profile from "@/components/Profile";
import { SidebarInset as MySidebarInset } from "@/components/ui/sidebar";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/db/db";
import SuscriptionInfo from "@/components/SuscriptionInfo";


// Dashboard usa useQuery para obtener el plan del usuario:
export default function Dashboard() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, updateUserPlan } = useUser();
  const [user, setUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState(null); // Nuevo estado para datos actualizados de Firestore
  const [loading, setLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState(null); // Estado para seleccionar sección activa
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

  // Suscripción en tiempo real a Firestore para obtener datos actualizados del usuario
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snap) => {
        if (snap.exists()) {
          setUpdatedUser(snap.data());
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  // useQuery para obtener el plan (o información relacionada) y actualizar estado global
  const { data: planData, refetch } = useQuery({
    queryKey: ["userPlan", user?.uid],
    queryFn: async () => {
      if (!user) throw new Error("Usuario no autenticado");
      const token = await user.getIdToken();
      const response = await fetch(`/api/get-user-plan?uid=${user.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        console.error("❌ Error en la respuesta:", await response.text());
        throw new Error("Error en la respuesta");
      }
      return response.json();
    },
    enabled: !!user,
    onSuccess: (data) => {
      updateUserPlan(data.plan); // Actualiza el plan en el contexto global
    },
  });

  useEffect(() => {
    if (user?.uid) {
      refetch(); // Refresca datos del plan
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
          <div className="flex items-center">
            <h4 className="mr-2">
              Bienvenido, {updatedUser?.name || user.displayName || user.email}
            </h4>
            <Badge className="bg-gray-700 hover:bg-gray-600 ml-1 text-white" variant="secondary">
              {authUser?.plan}
            </Badge>
          </div>
        </div>
      </header>
      <SidebarProvider>
        <AppSidebar setActiveComponent={setActiveComponent} />
        <MySidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {activeComponent === "UploadInfo" && <UploadInfo />}
            {activeComponent === "UploadProduct" && updatedUser?.empresaId && (
            <UploadProduct empresaId={updatedUser.empresaId} />
          )}
          {activeComponent === "Profile" && <Profile />}
          {activeComponent === "SuscriptionInfo" && <SuscriptionInfo />}
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
        </MySidebarInset>
      </SidebarProvider>
    </>
  );
}
