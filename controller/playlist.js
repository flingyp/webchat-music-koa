const Router = require('koa-router')
const router = new Router()
const getAccessToken = require('../utils/getAccessToken.js')
const ENV = 'test-4z53i'
const rp = require('request-promise')

router.get('/list', async(ctx,next) => {
    const access_token = await getAccessToken()
    const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ENV}&name=music`
    const options = {
        method: 'POST',
        uri: url,
        body: {
            $url: 'playlist',
            start: 0,
            count: 50
        },
        json: true // Automatically stringifies the body to JSON
    };
    
    ctx.body = await rp(options)
        .then(res => {
            return JSON.parse(res.resp_data).data
        })
        .catch(function (err) {
            return err
        });
})

module.exports = router
