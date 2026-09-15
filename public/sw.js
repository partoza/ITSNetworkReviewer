const CACHE_NAME = 'its-reviewer-offline-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const saveResponse = async (request, response) => {
  if (!response || !response.ok) return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
};

const networkFirst = async (request) => {
  try {
    return await saveResponse(request, await fetch(request));
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (request.mode === 'navigate') {
      const home = await caches.match('/');
      if (home) return home;
    }

    throw new Error('Resource is not available offline.');
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  event.respondWith(networkFirst(request));
});

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_APP') return;

  const resources = [...new Set(event.data.resources || [])];
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const results = await Promise.allSettled(resources.map(async (resource) => {
      const request = new Request(resource, { cache: 'reload' });
      const response = await fetch(request);
      if (!response.ok) throw new Error(`Could not cache ${resource}`);
      await cache.put(request, response);
    }));
    const saved = results.filter((result) => result.status === 'fulfilled').length;
    event.ports[0]?.postMessage({ success: saved === resources.length, saved, total: resources.length });
  })());
});
