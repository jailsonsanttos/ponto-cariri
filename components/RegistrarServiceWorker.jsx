"use client";

import { useEffect } from "react";

// Registra o Service Worker (arquivo public/sw.js), que é exigido pelo
// Chrome/Android para permitir "instalar" o Ponto Cariri como aplicativo.
export default function RegistrarServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silencioso: em ambiente local (http) o navegador pode bloquear.
      });
    }
  }, []);

  return null;
}
