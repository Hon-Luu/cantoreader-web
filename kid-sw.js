// Kid Mode offline support. Scoped to the whole site but deliberately handles
// ONLY Kid Mode's own requests; everything else (the Cangjie course) passes
// through untouched.
const CACHE = 'kid-v1'
const scope = new URL(self.registration.scope).pathname

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  if (e.request.method !== 'GET' || url.origin !== location.origin) return
  const path = url.pathname.slice(scope.length)
  const isPage = path === 'kid.html'
  const isData = path.startsWith('kid/')
  const isAsset = path.startsWith('assets/') || path.startsWith('kid-icon') || path === 'kid.webmanifest'
  if (!isPage && !isData && !isAsset) return

  if (isAsset) {
    // Hashed build files never change: cache first.
    e.respondWith(caches.match(e.request).then((hit) => hit || fetchAndStore(e.request)))
  } else {
    // The page and the stroke data can change with a deploy: network first, cache when offline.
    e.respondWith(fetchAndStore(e.request).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || Response.error())))
  }
})

async function fetchAndStore(request) {
  const res = await fetch(request)
  if (res.ok) {
    const cache = await caches.open(CACHE)
    cache.put(request, res.clone())
  }
  return res
}
