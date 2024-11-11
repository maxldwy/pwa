const port = 8080
const path = require('path')
// 导入 express
const express = require('express')

const app = express()
app.use(express.json())

// 设置静态文件目录
app.use(express.static(path.join(__dirname, '/web')))

// // 首页路由（可选）
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.get('/api/getList', async (req, res) => {
  res.status(200).json({
    code: '1',
    msg: '暂无漂流瓶',
  })
})

// 开启服务器，端口是 3000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
