"use client";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useHandleUpgrade } from "@/hooks/useHandleUpgrade";
import { useUser } from "@/context/AuthContext";

export default function FreeDashboardPanel() {
  const { user } = useUser();
  const handleUpgrade = useHandleUpgrade(user);

  return (
      <div className="max-w-lg mx-auto bg-white dark:bg-[#1f1b34] border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-8 flex flex-col gap-6 text-center mt-12">
        <h2 className="text-2xl font-bold mb-2 text-primary-dark dark:text-accent-cyan">Panel Free</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Bienvenido a La Citadel. Estás usando el plan <b>FREE</b>.
        </p>
        <div className="rounded bg-gray-100 dark:bg-gray-900 p-4 text-left mb-4">
          <b>¿Qué podés hacer?</b>
          <ul className="list-disc ml-6 mt-1 text-gray-700 dark:text-gray-200 text-sm">
            <li>Completar y editar tu perfil.</li>
            <li>Buscar y navegar empresas y productos publicados.</li>
            <li>Acceder a novedades y noticias del sector.</li>
            <li>Actualizar tu cuenta a PRO para desbloquear el panel de publicación y estadísticas.</li>
          </ul>
        </div>
        <Button
          className="w-full bg-accent-blue hover:bg-primary-dark text-white font-bold rounded-lg"
          onClick={() => handleUpgrade.mutate()}
          disabled={handleUpgrade.isPending}
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
      </div>
  );
}
