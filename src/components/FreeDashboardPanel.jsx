"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useHandleUpgrade } from "@/hooks/useHandleUpgrade";
import { useUser } from "@/context/AuthContext";
import { CheckCircle, XCircle } from "lucide-react";

export default function FreeDashboardPanel() {
  const { user } = useUser();
  const { theme } = useTheme();
  const handleUpgrade = useHandleUpgrade(user);

  const isDark = theme === "dark";

  const bg = "#8038e9";
  const text = "#5deb5a";
  const headerBg = "#292554";
  const border = "#c646a2";

  return (
    <div
      className="max-w-3xl mx-auto rounded-2xl shadow p-8 flex flex-col gap-6 mt-12"
      style={{
        backgroundColor: isDark ? "#1f1b34" : bg,
        color: isDark ? text : "white",
        border: `2px solid ${border}`,
      }}
    >
      <h2 className="text-3xl font-bold text-center">Comparativa de Planes</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rounded-lg overflow-hidden">
          <thead style={{ backgroundColor: headerBg }}>
            <tr>
              <th className="py-3 px-4 text-white">Características</th>
              <th className="py-3 px-4 text-center text-white">Free</th>
              <th className="py-3 px-4 text-center text-white">PRO</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Editar perfil", true, true],
              ["Ver empresas y productos", true, true],
              ["Acceder a noticias", true, true],
              ["Subir y editar productos", false, true],
              ["Aparecer en búsquedas públicas", false, true],
              ["Acceso a estadísticas", false, true],
            ].map(([title, free, pro], idx) => (
              <tr
                key={idx}
                className="border-t"
                style={{ borderColor: border }}
              >
                <td className="py-2 px-4">{title}</td>
                <td className="text-center">
                  {free ? (
                    <CheckCircle size={20} color={text} />
                  ) : (
                    <XCircle size={20} color={border} />
                  )}
                </td>
                <td className="text-center">
                  {pro ? (
                    <CheckCircle size={20} color={text} />
                  ) : (
                    <XCircle size={20} color={border} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        className="w-full font-bold rounded-lg mt-6"
        style={{
          backgroundColor: isDark ? text : "#c646a2",
          color: isDark ? "#1f1b34" : "white",
        }}
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
