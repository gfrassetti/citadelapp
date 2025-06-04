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
  CardFooter
} from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useHandleUpgrade } from "@/hooks/useHandleUpgrade";

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

/*   useEffect(() => {
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
  }, [user]); */

  useEffect(() => {
    if (!user?.uid) return;
    const url = new URL(window.location.href);
    const preapprovalId = url.searchParams.get("preapproval_id");
    if (!preapprovalId) return;
  
    fetch("/api/mercadopago/verify-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preapprovalId, uid: user.uid }),
    })
      .then((res) => {
        if (res.ok) updateUserPlan("pro");
      })
      .catch((err) => console.error("❌ Error verificando preapproval:", err));
  }, [user?.uid]);
  

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

  const handleUpgrade = useHandleUpgrade(user);
  
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
                    <span className="capitalize text-blue-600">
                    {componentLabels[activeComponent?.trim()] ?? activeComponent}
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
                  <Card className="max-w-md mx-auto text-center border border-gray-800 bg-muted text-foreground shadow-md">
                    <CardHeader className="space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight">Plan gratuito activado</h2>
                      <p className="text-sm text-muted-foreground">
                        Estás en el plan free. Para subir y editar productos, actualizá tu cuenta a PRO.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-left text-sm mb-4 space-y-2">
                        <li>✅ Acceso básico al panel</li>
                        <li>🚫 No podés subir ni editar productos</li>
                        <li>💡 Desbloqueá funciones premium al actualizar</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => handleUpgrade.mutate()}
                        disabled={handleUpgrade.isPending}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                      >
                        {handleUpgrade.isPending ? (
                          <>
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          "Actualizar a PRO"
                        )}
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

