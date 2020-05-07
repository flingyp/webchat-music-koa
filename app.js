const Koa = require('koa')

const app = new Koa()

app.use(async ctx => {
    ctx.body = 'hello word'
})

app.listen(3000, () => {
    console.log('服务运行在http://localhost:3000/中')
})