"use client";

import { useTheme } from "next-themes";
import clsx from "clsx";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className={clsx(
        "w-full border-t px-6 py-10 mt-auto",
        theme === "dark" ? "bg-[#1f1b34] text-gray-100" : "bg-gray-100 text-black"
      )}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h4 className="font-bold text-lg mb-2">La Citadel</h4>
          <p className="opacity-80">
            Tu marketplace mayorista para conectar empresas y productos de manera eficiente.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Navegación</h4>
          <ul className="space-y-1">
            <li><a href="/">Inicio</a></li>
            <li><a href="/register">Registrarse</a></li>
            <li><a href="/login">Ingresar</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contacto</h4>
          <p>Email: contacto@lacitadel.com</p>
          <p>WhatsApp: +54 9 11 1234 5678</p>
          <p>Ubicación: Buenos Aires, Argentina</p>
        </div>
      </div>
      <div className="mt-8 text-center text-xs opacity-70">
        © 2025 La Citadel. Todos los derechos reservados.
      </div>
    </footer>
  );
}
