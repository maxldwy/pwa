const express = require('express')
const path = require('path')
const cors = require('cors')

const port = 3008

const app = express()
app.use(cors())
app.use(express.json())

// 设置静态文件目录
app.use(express.static(path.join(__dirname, '/web')))

// 首页路由（可选）
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'web', 'index.html')

  res.sendFile(filePath)
})

app.get('/api/getList', async (req, res) => {
  const arr = []
  for (i = 0; i < 6; i++) {
    arr.push({
      val: Math.floor(Math.random() * 101),
    })
  }
  res.status(200).json(arr)
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
