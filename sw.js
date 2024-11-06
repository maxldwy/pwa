const cacheName = 'v1'
const newCacheName = 'v2'

self.addEventListener('install', (event) => {
  // 确保 Service Worker 不会在 waitUntil() 里面的代码执行完毕之前安装完成
  event.waitUntil(
    // 创建了叫做 v1 的新缓存
    caches.open(cacheName).then((cache) => cache.addAll(['./index.html']))
  )
})

// 缓存优先 如果是需要对整个页面请求资源进行缓存管理，那么可以通过fetch事件拦截请求实现动态缓存，代码如下：
const cacheFirst = async (request) => {
  // 从缓存中读取 respondWith表示拦截请求并返回自定义的响应
  const responseFromCache = await caches.match(request)
  console.log('responseFromCache', responseFromCache)
  if (responseFromCache) {
    return responseFromCache
  }
  // 如果缓存中没有，就从网络中请求
  const responseFromServer = await fetch(request)
  const cache = await caches.open(cacheName)
  // 将请求到的资源添加到缓存中
  cache.put(request, responseFromServer.clone())
  return responseFromServer
}
self.addEventListener('fetch', function (event) {
  // 拦截请求
  console.log('caches match')
  console.log('fetch', event.request.url)
  event.respondWith(cacheFirst(event.request))
})

// 当你的Service Worker js文件有更新，需要删除旧的缓存，同时启动新的 Service Worker cache，代码如下：
const deleteCache = async (key) => {
  await caches.delete(key)
}
const deleteOldCaches = async () => {
  const cacheKeepList = [newCacheName]
  const keyList = await caches.keys()
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key))
  await Promise.all(cachesToDelete.map(deleteCache))
}
self.addEventListener('activate', function (event) {
  event.waitUntil(deleteOldCaches())
})
