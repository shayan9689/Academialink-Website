// Minimal service worker to prevent 404 when browser requests /sw.js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
