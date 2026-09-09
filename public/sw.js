// public/sw.js
// Service Worker mínimo, necessário para o Chrome permitir que o site
// seja "instalado" como aplicativo (PWA). Não faz cache agressivo do
// conteúdo, para garantir que as notícias e páginas sempre apareçam
// atualizadas.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
