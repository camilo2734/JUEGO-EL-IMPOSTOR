
const CACHE_NAME = 'impostor-v1';

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Estrategia de red: Intentar red, si falla no hace nada (mínimo para cumplir requisitos)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
