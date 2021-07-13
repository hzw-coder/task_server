const db = require('./db')

// 登录
async function login(res, username, password) {
    let result
    try {
        const sql = `select * from user where username='${username}' and password='${password}'`
        result = await new Promise((resolve, reject) => {
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error);
        res.send({
            errmsg: '登录失败'
        })
        return
    }
    return result
}

// 查询登录用户是否存在
async function queryUser(res, username) {
    let result
    try {
        const sql = `select * from user where username='${username}'`
        result = await new Promise((resolve, reject) => {
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error);
        res.send({
            errmsg: '查询用户失败'
        })
        return
    }
    return result
}

module.exports = {
    login,
    queryUser
}