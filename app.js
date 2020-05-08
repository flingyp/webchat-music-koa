const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const cors = require('koa2-cors')
const ENV = 'test-4z53i'
const koaBody = require('koa-body')

// 跨域
app.use(cors({
    origin: ['http://localhost:9528'],
    credentials: true
}))

// 接收POST参数
app.use(koaBody({
    multipart: true,
}))

app.use(async (ctx,next) => {
    // ctx.body = 'Hello Word'
    ctx.state.env = ENV
    await next()
})

const playlist = require('./controller/playlist.js') 
router.use('/playlist', playlist.routes())

app.use(router.routes())
app.use(router.allowedMethods())


app.listen(3000, () => {
    console.log('服务运行在http://localhost:3000/中')
})