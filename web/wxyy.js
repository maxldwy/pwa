const CACHE_NAME = 'cache_v5'
const CACHE_URLS = ['/', '/144x144.png', '/manifest.json', '/index.css'] // 确保URL正确

self.addEventListener('install', async (event) => {
  console.log('install')

  const cache = await caches.open(CACHE_NAME)
  await cache.addAll(CACHE_URLS)
  event.waitUntil(self.skipWaiting()) // 确保安装完成前不跳过
})

self.addEventListener('activate', async (event) => {
  console.log('activate')

  const keys = await caches.keys()
  keys.forEach(async (key) => {
    if (key !== CACHE_NAME) {
      await caches.delete(key)
    }
  })
  event.waitUntil(self.clients.claim()) // 确保激活完成前获取控制权
})

self.addEventListener('fetch', function (event) {
  console.log('fetch', event.request)
  const request = event.request

  if (request.url.includes('/api')) {
    event.respondWith(networkFirst(request))
  } else {
    event.respondWith(cacheFirst(request))
  }
})

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  try {
    const fetchResponse = await fetch(request)
    const responseToCache = fetchResponse.clone()
    await cache.put(request, responseToCache)
    return fetchResponse
  } catch (error) {
    console.error('Network error:', error)
    const cached = await cache.match(request)
    return cached || new Response('Network or cache error', { status: 500 })
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  try {
    const cached = await cache.match(request)
    return (
      cached || new Response('Resource not found in cache', { status: 404 })
    )
  } catch (error) {
    console.error('Cache error:', error)
    const fetchResponse = await fetch(request)
    return fetchResponse
  }
}
