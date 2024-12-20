async function renderHtml() {
  fetch('./api/getList')
    .then((response) => response.json())
    .then((data) => {
      let html = ''
      data.forEach((element) => {
        html += `<h3>随机数为：${element.val}</h3>`
      })
      document.getElementById('pwa').innerHTML = html
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

async function registrationSW() {
  // 防止与其他资源竞争，故在onload中进行创建service worker
  window.addEventListener('load', () => {
    // 注册 Service worker
    if ('serviceWorker' in window.navigator) {
      navigator.serviceWorker
        .register('./sw.js')
        .then((registration) => {
          if (registration.installing) {
            console.log('正在安装 Service worker')
          } else if (registration.waiting) {
            console.log('已安装 Service worker installed')
          } else if (registration.active) {
            console.log('激活 Service worker')
          }
        })
        .catch((error) => {
          console.error(`注册失败：${error}`)
        })
    }
  })
}

/**
 * 如果页面一进来就没有网络，给用户一个通知
 */
if (Notification.permission === 'default') {
  Notification.requestPermission()
}
if (!navigator.onLine) {
  new Notification('提示', { body: '你当前没有网络，访问的是缓存' })
}
window.addEventListener('online', () => {
  new Notification('提示', {
    body: '你已经连上网络了，请刷新访问最新的数据',
  })
})

renderHtml()
registrationSW()
