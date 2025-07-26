"use client";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useHandleUpgrade } from "@/hooks/useHandleUpgrade";
import { useUser } from "@/context/AuthContext";

export default function FreeDashboardPanel() {
  const { user } = useUser();
  const handleUpgrade = useHandleUpgrade(user);

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-[#1f1b34] border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-8 flex flex-col gap-6 mt-12">
      <h2 className="text-2xl font-bold mb-2 text-center text-primary-dark dark:text-accent-cyan">
        Panel Free
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
        Bienvenido a La Citadel. Estás usando el plan <b>FREE</b>.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse rounded-lg overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white">
            <tr>
              <th className="py-2 px-4">Características</th>
              <th className="py-2 px-4 text-center">Free</th>
              <th className="py-2 px-4 text-center">PRO</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-200">
            <tr className="border-t dark:border-gray-700">
              <td className="py-2 px-4">Editar perfil</td>
              <td className="text-center">✅</td>
              <td className="text-center">✅</td>
            </tr>
            <tr className="border-t dark:border-gray-700">
              <td className="py-2 px-4">Ver empresas y productos</td>
              <td className="text-center">✅</td>
              <td className="text-center">✅</td>
            </tr>
            <tr className="border-t dark:border-gray-700">
              <td className="py-2 px-4">Acceder a noticias</td>
              <td className="text-center">✅</td>
              <td className="text-center">✅</td>
            </tr>
            <tr className="border-t dark:border-gray-700">
              <td className="py-2 px-4">Subir y editar productos</td>
              <td className="text-center">❌</td>
              <td className="text-center">✅</td>
            </tr>
            <tr className="border-t dark:border-gray-700">
              <td className="py-2 px-4">Aparecer en búsquedas públicas</td>
              <td className="text-center">❌</td>
              <td className="text-center">✅</td>
            </tr>
            <tr className="border-t dark:border-gray-700">
              <td className="py-2 px-4">Acceso a estadísticas</td>
              <td className="text-center">❌</td>
              <td className="text-center">✅</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Button
        className="w-full bg-accent-blue hover:bg-primary-dark text-white font-bold rounded-lg mt-6"
        onClick={() => handleUpgrade.mutate()}y
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
