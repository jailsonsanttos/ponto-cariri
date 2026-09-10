// public/sw.js
// Este service worker foi desativado porque estava causando exibição
// de conteúdo desatualizado em algumas visitas. Este arquivo agora só
// serve para remover, com segurança, a versão antiga que já estava
// instalada no navegador de quem visitou o site antes.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.registration.unregister().then(() => {
    return self.clients.matchAll();
  }).then((clients) => {
    clients.forEach((client) => client.navigate(client.url));
  });
});
