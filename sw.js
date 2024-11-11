/**
 * 1.第一次加载的时候 先执行install然后是activate
 * 2.只要sw.js发生改变就会触发install方法
 * 3.所以为了让最新的service worker生效，都会在install方法中增加一个语句
     self.skipWaiting(), 让service worker跳过等待直接进入activate状态
 * 4.service worker激活后，会在下一次刷新页面的时候生效，
     可以通过在activate方法中增加self.clients.claim()立即获取控制权
 * 5.cache.add(request)浏览器会重新请求并缓存响应
 * 6.cache.put(request,fetchResponse)将请求/响应直接存储到缓存对象中
 */

const CACHE_NAME = 'cache_v6'
const CACHE_URLS = ['/', '/144x144.png', '/manifest.json', '/index.css']

self.addEventListener('install', async (event) => {
  console.log('install')

  // 打开一个缓存
  const cache = await caches.open(CACHE_NAME)
  //存储所有资源
  await cache.addAll(CACHE_URLS)
  // 直接进入activate状态
  await self.skipWaiting()
  // event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', async (event) => {
  console.log('activate')
  // 清除旧的资源
  const keys = await caches.keys()
  keys.forEach((key) => {
    if (key !== CACHE_NAME) {
      caches.delete(key)
    }
  })
  // 立即获取控制权
  await self.clients.claim()
  // event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', function (event) {
  console.log('fetch', event.request)
  const request = event.request
  //只缓存同源的资源
  // const newUrl = new URL(request.url)
  // if (newUrl.origin !== self.origin) {
  //   return
  // }
  //判断资源是否能够请求成功，如果成功就响应结果，如果断网就读取caches缓存
  if (request.url.includes('/api')) {
    //网络请求网络优先
    event.respondWith(networkFirst(request))
  } else {
    // 静态资源缓存优先
    event.respondWith(cacheFirst(request))
  }
})
// 网络优先
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  try {
    //先读取网络资源
    const fetchResponse = await fetch(request)
    //更新缓存
    cache.put(request, fetchResponse.clone())
    return fetchResponse
  } catch (error) {
    console.error('Network error:', error)
    const cached = await cache.match(request)
    return cached || new Response('networkFirst error', { status: 500 })
  }
}
// 缓存优先 如果是需要对整个页面请求资源进行缓存管理，那么可以通过fetch事件拦截请求实现动态缓存，代码如下：
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  try {
    const cached = await cache.match(request)
    return cached || new Response('cacheFirst error', { status: 404 })
  } catch (error) {
    const fetchResponse = await fetch(request)
    return fetchResponse
  }
}
