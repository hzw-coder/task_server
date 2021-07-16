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
                // 保存当前登录用户的id
                req.session['user_id'] = loginResult[0].id
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

// 退出登录
router.post('/api/logout', (req, res) => {
    // 删除(session)登录状态
    delete req.session['user_id']
    delete req.session['img_captcha']
    res.send({
        code: '200',
        msg: '退出登录成功'
    })
})

// 提交反馈接口
router.post('/api/comment', (req, res) => {
    (async function () {
        let {
            title,
            description
        } = req.body
        if (!title) {
            res.send({
                msg: '请填写标题',
                code: '401',
            })
            return
        }
        if (!description) {
            res.send({
                msg: '请填写内容',
                code: '401'
            })
            return
        }
        // 从session中获取当前用户id
        let user_id = req.session['user_id']
        if (!user_id) {
            res.send({
                msg: '用户未登录，请登录',
                code: '401'
            })
            return
        }
        // 数据库操作
        let commentResult = await handleDB.submitComment(res, user_id, title, description)
        if (!commentResult.insertId) {
            res.send({
                msg: '提交反馈出错',
                code: '401'
            })
            return
        };
        res.send({
            msg: '提交反馈成功',
            code: '200'
        })

    })()
})

router.post('/api/addtask', (req, res) => {
    (async function () {
        let {
            category_id,
            name,
            description,
            label_id
        } = req.body
        if (!category_id || !name || !description || !label_id) {
            res.send({
                msg: '请填写完整内容',
                code: '401'
            })
            return
        }
        let user_id = req.session['user_id']
        // 添加任务
        let addTaskResult = await handleDB.submitTask(res, user_id, category_id, name, description)
        if (!addTaskResult.insertId) {
            res.send({
                msg: '添加任务出错',
                code: '401'
            })
            return
        }
        // 向task_label添加task_id
        let task_id = addTaskResult.insertId
        let tasklabelResult = await handleDB.addTaskLabel(res, task_id, label_id)
        if (!tasklabelResult.insertId) {
            res.send({
                msg: '添加出错',
                code: '401'
            })
            return
        }
        res.send({
            msg: '添加任务成功',
            code: '200'
        })
    })()
})

// 获取等级列表
router.get('/api/category', (req, res) => {
    (async function () {
        let categoryResult = await handleDB.queryCategory(res)
        if (categoryResult.length) {
            res.send({
                msg: '获取等级成功',
                code: '200',
                data: categoryResult
            })
        } else {
            res.send({
                msg: '获取等级失败',
                code: '401',
            })
            return
        }
    })()
})

// 获取标签列表
router.get('/api/label', (req, res) => {
    (async function () {
        let labelResult = await handleDB.queryLabel(res)
        if (labelResult.length) {
            res.send({
                msg: '获取标签成功',
                code: '200',
                data: labelResult
            })
        } else {
            res.send({
                msg: '获取标签失败',
                code: '401',
            })
            return
        }
    })()
})

// 获取标签-任务数列表数据
router.get('/api/label_task', (req, res) => {
    (async function () {
        let result = await handleDB.queryLabel_Task(res)

        console.log(result);

    })()
})


// 获取等级-任务数列表数据
router.get('/api/category_task', (req, res) => {
    (async function () {
        let result = await handleDB.queryCategory_Task(res)

        console.log(result);

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