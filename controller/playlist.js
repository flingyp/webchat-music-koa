const Router = require('koa-router')
const router = new Router()
const callCloudFn = require('../utils/callCloudFn')


router.get('/list', async (ctx, next) => {
    const query = ctx.request.query
    const res = await callCloudFn(ctx, 'music', {
        $url: 'playlist',
        start: parseInt(query.start),
        count: parseInt(query.count)
    })
    let data = []
    if (res.resp_data) {
        data = JSON.parse(res.resp_data).data
    }
    ctx.body = {
        data,
        code: 20000,
    }
})

module.exports = router
