const express = require('express')
const cookieParse = require('cookie-parser')
const session = require('express-session')
const keys = require('./keys.js')
const jwt = require('jsonwebtoken')

const passportRouter = require('./routes/passport.js')
let appConfig = app => {
    // 跨域配置
    app.use((req, res, next) => {
        // 响应头设置 添加Methods: OPTIONS、Headers: Authorization
        res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // 设置允许来自哪里的跨域请求访问（值为*代表允许任何跨域请求，但是没有安全保证）
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); // 设置允许接收的请求类型
        res.header('Access-Control-Allow-Headers', 'content-type,Access-Token,Authorization,token'); //设置允许前端请求时带有的字段值
        res.header("Access-Control-Request-Headers", "content-Type, Authorization"); //发出请求时报头用于预检请求让服务器知道哪些 HTTP 头的实际请求时将被使用
        res.header('Access-Control-Allow-Credentials', 'true'); // 允许客户端携带证书式访问。保持跨域请求中的Cookie。注意：此处设true时，Access-Control-Allow-Origin的值不能为 '*'
        next()
    })
    // 后端拦截
    app.use((req, res, next) => {
        if (req.path !== '/api/login' || req.path !== '/api/login/img_captcha') {
            let token = req.headers.Authorization
            jwt.verufy(token, keys.jwt_salt, (err, decode) => {
                console.log(decode);
                if (err) {
                    res.send({
                        code: '406',
                        msg: 'token过期，请重新登录'
                    })
                } else {
                    next()
                }
            })
        } else {
            next()
        }
    })


    // session配置
    app.use(session({
        secret: keys.session_key,
        //name:'img_captcha',
        resave: true,
        saveUninitialized: false,
        cookie: {
            //secure: true,
            maxAge: 1000 * 60 * 3
        }
    }))
    //app.use(cookieParse())

    // 配置post请求参数
    app.use(express.json()) //解析json格式
    app.use(express.urlencoded({
        extended: false
    }))

    app.use(passportRouter)
}

module.exports = appConfig