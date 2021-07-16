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
            msg: '登录失败'
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
            msg: '查询用户失败'
        })
        return
    }
    return result
}

// 提交反馈
async function submitComment(res, user_id, title, description) {
    let result
    try {
        const sql = `insert into feedback(user_id, title, description) values('${user_id}','${title}','${description}')`
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
            msg: '提交反馈失败'
        })
        return
    }
    return result
}

// 查询分类列表
async function queryCategory(res) {
    let result
    try {
        const sql = `select * from category`
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
            msg: '查询分类失败'
        })
        return
    }
    return result
}


// 查询标签列表
async function queryLabel(res) {
    let result
    try {
        const sql = `select * from label`
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
            msg: '查询标签失败'
        })
        return
    }
    return result
}
// 添加任务
async function submitTask(res, user_id, category_id, name, description) {
    let result
    try {
        const sql = `insert into task(user_id, category_id, name, description) values('${user_id}','${category_id}','${name}','${description}')`
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
            msg: '添加任务失败'
        })
        return
    }
    return result
}

// 添加任务_标签
async function addTaskLabel(res, task_id, label_id) {
    let result
    try {
        const sql = `insert into task_label(task_id, label_id) values('${task_id}','${label_id}')`
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
            msg: '添加失败'
        })
        return
    }
    return result
}

// 查询标签名及任务数
async function queryLabel_Task(res, curPage, pageSize) {
    /**
     * curPage是当前第几页；
     * pageSize是一页多少条记录
     */
    let result
    try {
        const sql = `select label.id,label.name,
        ( select count(task_label.label_id) 
        from task_label where label.id=task_label.label_id ) as countnum 
        from label limit ${curPage},${pageSize}`
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
            msg: '查询失败'
        })
        return
    }
    return result
}

// 查询等级名及任务数
async function queryCategory_Task(res, curPage, pageSize) {
    /**
     * curPage是当前第几页；
     * pageSize是一页多少条记录
     */
    let result
    try {
        const sql = `select category.id,category.name,
        ( select count(task.category_id) 
        from task where category.id=task.category_id ) as countnum 
        from category limit ${curPage},${pageSize}`
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
            msg: '查询失败'
        })
        return
    }
    return result
}

module.exports = {
    login,
    queryUser,
    submitComment,
    queryCategory,
    queryLabel,
    submitTask,
    addTaskLabel,
    queryLabel_Task,
    queryCategory_Task
}