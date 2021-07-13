const express = require('express')
const router = express.Router()
const Captcha = require('../utils/captcha/index')
const md5 = require('md5')
const keys = require('../keys')
const jwt = require('jsonwebtoken')
const handleDB = require('../db/handleDB')

// 获取验证码登录接口
router.get('/api/login/img_captcha', (req, res) => {
    let captchaObj = new Captcha()
    let captcha = captchaObj.getCode()
    res.setHeader('Content-Type', 'image/svg+xml')
    // 将图片的验证码存入到 session 中
    req.session['img_captcha'] = captcha.text
    res.type('svg')
    res.send(captcha.data)
})
// 登录接口
router.post('/api/login', (req, res) => {
    (async function () {
        let {
            username,
            password,
            captcha
        } = req.body
        console.log(req.body);
        if (!username || !password) {
            res.send({
                msg: '用户名或密码不能为空', //返回内容
                code: '401' //状态码 
            })
            return
        }
        console.log(req.session['img_captcha']);
        if (captcha.toLowerCase() !== req.session['img_captcha'].toLowerCase()) {
            res.send({
                msg: "验证码错误",
                code: '402'
            })
            return
        }
        let queryUser = await handleDB.queryUser(res, username)
        if (queryUser <= 0) {
            res.send({
                msg: "用户不存在",
                code: '403'
            })
        } else {
            let loginResult = await handleDB.login(res, username, md5(md5(password) + keys.password_key))
            if (loginResult.length <= 0) {
                res.send({
                    msg: "用户名或密码错误",
                    code: '405'
                })
                return
            } else { //正确
                // 生成token
                let token = jwt.sign({
                    username: username
                }, keys.jwt_salt, {
                    expiresIn: 60 * 60 * 2
                })
                res.send({
                    msg: "登录成功",
                    code: '200',
                    token: token
                })
            }
        }
    })()
})


// 生成token
// router.get('/passport/token', (req, res) => {
//     // 生成token
//     const token = jwt.sign({
//         id: 1,
//         username: 'zhangsan'
//     }, keys.jwt_salt, {
//         expiresIn: 60 * 60 * 2
//     })

//     res.send({
//         errmsg: '登录成功',
//         errno: '200',
//         result: {
//             token: token
//         }
//     })
// })

module.exports = router