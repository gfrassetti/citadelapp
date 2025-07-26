"use client";

import { useTheme } from "next-themes";
import clsx from "clsx";

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer
      className={clsx(
        "w-full border-t px-6 py-10 mt-auto",
        isDark ? "bg-[#1f1b34] text-gray-100 border-gray-800" : "bg-omalmd text-black border-gray-200"
      )}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h4 className="font-bold text-lg mb-2">La Citadel</h4>
          <p className={clsx(isDark ? "opacity-80" : "text-gray-700 opacity-80")}>
            Tu marketplace mayorista para conectar empresas y productos de manera eficiente.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Navegación</h4>
          <ul className="space-y-1">
            <li>
              <a
                href="/"
                className={clsx(
                  "transition-colors hover:text-accent-cyan",
                  isDark ? "text-gray-100" : "text-black"
                )}
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="/register"
                className={clsx(
                  "transition-colors hover:text-accent-cyan",
                  isDark ? "text-gray-100" : "text-black"
                )}
              >
                Registrarse
              </a>
            </li>
            <li>
              <a
                href="/login"
                className={clsx(
                  "transition-colors hover:text-accent-cyan",
                  isDark ? "text-gray-100" : "text-black"
                )}
              >
                Ingresar
              </a>
            </li>
            <li>
              <a
                href="/dashboard"
                className={clsx(
                  "transition-colors hover:text-accent-cyan",
                  isDark ? "text-gray-100" : "text-black"
                )}
              >
                Mi Panel
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contacto</h4>
          <p>Email: contacto@lacitadel.com</p>
          <p>WhatsApp: +54 9 11 1234 5678</p>
          <p>Ubicación: Buenos Aires, Argentina</p>
        </div>
      </div>
      <div className={clsx("mt-8 text-center text-xs opacity-70", isDark ? "text-gray-300" : "text-gray-700")}>
        © 2025 La Citadel. Todos los derechos reservados.
      </div>
    </footer>
  );
}
