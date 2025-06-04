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
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@/context/AuthContext";
import UploadInfo from "@/components/UploadInfo";
import UploadProduct from "@/components/UploadProduct";
import Profile from "@/components/Profile";
import { SidebarInset as MySidebarInset } from "@/components/ui/sidebar";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/db/db";
import SuscriptionInfo from "@/components/SuscriptionInfo";
import EditInfo from "@/components/EditInfo";
import EditProduct from "@/components/EditProduct";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";

export default function Dashboard() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, updateUserPlan } = useUser();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const preapprovalId = url.searchParams.get("preapproval_id");

    if (preapprovalId && user?.uid) {
      fetch("/api/mercadopago/verify-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preapprovalId, uid: user.uid }),
      })
        .then((res) => {
          if (res.ok) {
            updateUserPlan("pro");
          }
        })
        .catch((err) => console.error("❌ Error verificando preapproval:", err));
    }
  }, [user]);

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

  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setUserData(data);
          updateUserPlan(data.plan);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleUpgrade = useMutation({
    mutationFn: async () => {
      if (!user?.uid || !user?.email) throw new Error("Faltan datos del usuario");
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
  
  const componentLabels = {
    UploadInfo: "Subir información",
    UploadProduct: "Subir producto",
    EditInfo: "Editar tu información",
    EditProduct: "Editar producto",
    Profile: "Perfil",
    SuscriptionInfo: "Mi suscripción",
  };
  
  if (loading || !authUser?.plan || !userData) return <p>Cargando...</p>;

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
              Bienvenido, {userData?.name || user.displayName || user.email}
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
            {activeComponent && (
              <div className="mb-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        className="text-black cursor-pointer"
                        onClick={() => setActiveComponent(null)}
                      >
                        Mi Cuenta
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <span className="capitalize text-white">
                      {componentLabels[activeComponent] || activeComponent}
                    </span>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            )}

            {activeComponent === "UploadInfo" && <UploadInfo />}
            {activeComponent === "UploadProduct" && userData?.empresaId && (
              <UploadProduct empresaId={userData.empresaId} />
            )}
            {activeComponent === "EditInfo" && <EditInfo />}
            {activeComponent === "EditProduct" && <EditProduct />}
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

