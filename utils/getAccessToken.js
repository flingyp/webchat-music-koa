const rp = require('request-promise')
const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, './access_token.json')


const APPID = 'wx8939d6abe6252f2d'
const APPSECRET = '6e832d03414aa67a093e55df285d1ce6'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`

// 请求 access_token
const updateAccessToken = async () => {
    // 获取到接口凭证是字符串类型
    const resStr = await rp(URL)
    // 转换成 JSON对象
    const res = JSON.parse(resStr)
    // 下面是将请求到的 res 里的 access_token 保持到JSON文件中
    if(res.access_token) {
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: res.access_token,
            createTime: new Date()
        }))
    } else { 
        // 如果因为网络服务器等其他问题没有请求到 res.access_token 则再次调用 updateAccessToken() 
        await updateAccessToken()
    }
}

// 读取 access_token
const getAccessToken = async () => {
    try {
        // 读取 access_token.json 文件的内容  是字符串类型
        const readRes = fs.readFileSync(fileName, 'utf8')
        // 转换成 JSON 对象
        const readObj = JSON.parse(readRes)
        // 文件里的  access_token 创建时间的毫秒数
        const createTime = new Date(readObj.createTime).getTime()
        // 获取当前时间 的毫秒数
        const nowTime = new Date().getTime()
        // 判断 文件里的 access_token 是否已经超过两小时(过期) 如果过期重新 请求 access_token
        if(nowTime - createTime /1000/60/60 >= 2) {
            await updateAccessToken() 
            await getAccessToken()
        }
        return readObj.access_token
    } catch (error) {
       // 异常的捕获 当文件不存在 时 try 里的读取文件操作会报错 这时候会到 catch 里  
       // 然后调用 updateAccessToken() 方法  再去读取 getAccessToken()
        await updateAccessToken() 
        await getAccessToken()
    }
}

// access_token` 的有效期目前为 **2 个小时**，需定时刷新，重复获取将导致上次获取的 `access_token` 失效 
// 所以要设置个定时器  每过一定的时间(2个小时但提前五分钟)去 请求 access_token
setInterval(async () => {
    await updateAccessToken()
}, (7200 - 300) * 1000);



module.exports = getAccessToken