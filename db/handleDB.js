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
async function submitComment(res, user_id, title, description, create_time) {
    let result
    try {
        const sql = `insert into feedback(user_id, title, description,create_time) values('${user_id}','${title}','${description}','${create_time}')`
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

// 添加等级分类
async function addCategory(res, user_id, name, create_time) {
    let result
    try {
        const sql = `insert into category(user_id, name,create_time) values('${user_id}','${name}','${create_time}')`
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
            msg: '操作数据库失败'
        })
        return
    }
    return result
}

// 添加标签
async function addLabel(res, user_id, name, create_time) {
    let result
    try {
        const sql = `insert into label(user_id, name,create_time) values('${user_id}','${name}','${create_time}')`
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
            msg: '操作数据库失败'
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

// 根据名称查询分类
async function queryCategoryByName(res, name) {
    let result
    try {
        const sql = `select * from category where name='${name}'`
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

// 根据名称查询标签
async function queryLabelByName(res, name) {
    let result
    try {
        const sql = `select * from label where name='${name}'`
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
async function submitTask(res, user_id, category_id, name, description, create_time) {
    let result
    try {
        const sql = `insert into task(user_id, category_id, name, description,create_time) values('${user_id}','${category_id}','${name}','${description}','${create_time}')`
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
async function addTaskLabel(res, task_id, label_id, create_time) {
    let result
    try {
        const sql = `insert into task_label(task_id, label_id,create_time) values('${task_id}','${label_id}','${create_time}')`
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
/**
 * curPage是当前第几页；
 * pageSize是一页多少条记录
 */
async function queryLabel_Task(res, curPage, pageSize) {
    let result
    try {
        let starIndex = (curPage - 1) * pageSize;
        const sql = `select label.id,label.name,
        ( select count(distinct task.id) from task
        left join task_label on task.id=task_label.task_id
        where task.run=1 and task_label.label_id=label.id) as countnum 
        from label limit ${starIndex},${pageSize}`
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
/**
 * curPage是当前第几页；
 * pageSize是一页多少条记录
 */
async function queryCategory_Task(res, curPage, pageSize) {
    let result
    try {
        let starIndex = (curPage - 1) * pageSize;
        const sql = `select category.id,category.name,
        ( select count(task.category_id) 
        from task where run=1 and category.id=task.category_id ) as countnum 
        from category limit ${starIndex},${pageSize}`
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

// 根据id删除分类
async function deleteCategoryById(res, id) {
    let result
    try {
        const sql = `delete from category where id='${id}'`
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
            msg: '操作失败'
        })
        return
    }
    return result
}

// 根据id删除标签
async function deleteLabelById(res, id) {
    let result
    try {
        const sql = `delete from label where id='${id}'`
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
            msg: '操作失败'
        })
        return
    }
    return result
}

// 根据id查询分类
async function queryCategoryById(res, id) {
    let result
    try {
        const sql = `select * from category where id='${id}'`
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
            msg: '操作失败'
        })
        return
    }
    return result
}
// 根据id查询标签
async function queryLabelById(res, id) {
    let result
    try {
        const sql = `select * from label where id='${id}'`
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
            msg: '操作失败'
        })
        return
    }
    return result
}

// 修改单个分类
async function updateCategoryById(res, id, name, update_time) {
    let result
    try {
        const sql = `update category set name='${name}',update_time='${update_time}' where id='${id}'`
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
            msg: '操作失败'
        })
        return
    }
    return result
}

// 修改单个标签
async function updateLabelById(res, id, name, update_time) {
    let result
    try {
        const sql = `update label set name='${name}',update_time='${update_time}' where id='${id}'`
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
            msg: '操作失败'
        })
        return
    }
    return result
}

// 模糊查询任务
async function queryTask(res, name, category_id, label_id, curPage, pageSize) {
    let result
    let sql
    try {
        /*
        if (label_id == '') {
            sql = `select * from task where concat(IFNULL(name,''),
                IFNULL(category_id,''))
                like concat('%${name}%','${category_id}')`
        } else {
            sql = `select t.* from task t,task_label tl 
                where t.id=tl.task_id and tl.label_id='${label_id}'`
        }
        */
        let starIndex = (curPage - 1) * pageSize;
        sql = `select distinct t.* from task t left join task_label tl on
             t.id=tl.task_id
             where concat(IFNULL(t.name,''),IFNULL(t.category_id,''),IFNULL(tl.label_id,''))
             like concat('%${name}%','${category_id}','${label_id}')
             and t.run=1 limit ${starIndex},${pageSize}`
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
            msg: '操作失败'
        })
        return
    }
    return result
}

// 查询任务总数
async function queryTaskCount(res, name, category_id, label_id) {
    let result
    let sql
    try {
        sql = `select distinct t.* from task t left join task_label tl on
             t.id=tl.task_id
             where concat(IFNULL(t.name,''),IFNULL(t.category_id,''),IFNULL(tl.label_id,''))
             like concat('%${name}%','${category_id}','${label_id}')
             and t.run=1`
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
            msg: '操作失败'
        })
        return
    }
    return result
}

// 删除单个任务
async function deleteTaskById(res, id, update_time) {
    let result
    try {
        const sql = `update task set run=0,update_time='${update_time}' where id='${id}'`
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
            msg: '操作失败'
        })
        return
    }
    return result
}

// 根据id查询任务
async function queryTaskById(res, id) {
    let result
    try {
        const sql = `select * from task where id='${id}'`
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
            msg: '操作失败'
        })
        return
    }
    return result
}

// 修改单个任务
async function updateTaskById(res, id, name, description, update_time) {
    let result
    try {
        const sql = `update task set name='${name}',description='${description}',update_time='${update_time}' where id='${id}'`
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
            msg: '操作失败'
        })
        return
    }
    return result
}

// 待完成任务数量
async function unCompleted(res) {
    let result
    try {
        const sql = `select count(*) as count from task where run=1 `
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
            msg: '操作失败'
        })
        return
    }
    return result
}
// 上周完成任务数量
async function laskweekCompleted(res) {
    let result
    try {
        const sql = `select count(*) as count from task where run=0 and
         yearweek(date_format(update_time,'%y-%m-%d'))=yearweek(now())-1 `
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
            msg: '操作失败'
        })
        return
    }
    return result
}

// 上月完成任务数量
async function laskmonthCompleted(res) {
    let result
    try {
        const sql = `select count(*) as count from task where run=0 and
         month(from_unixtime(update_time,'%y-%m-%d'))=month(now()) `
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
            msg: '操作失败'
        })
        return
    }
    return result
}

// 已完成任务数量
async function completed(res) {
    let result
    try {
        const sql = `select count(*) as count from task where run=0 `
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
            msg: '操作失败'
        })
        return
    }
    return result
}

//统计最近7天内的数量按天分组
async function calculaLatelyAweek(res) {
    let result
    try {
        const sql = `
        select date_format(a.click_date,'%y-%m-%d') as click_date,ifnull(b.count,0) as count
        from (
            SELECT curdate() as click_date
            union all
            SELECT date_sub(curdate(), interval 1 day) as click_date
            union all
            SELECT date_sub(curdate(), interval 2 day) as click_date
            union all
            SELECT date_sub(curdate(), interval 3 day) as click_date
            union all
            SELECT date_sub(curdate(), interval 4 day) as click_date
            union all
            SELECT date_sub(curdate(), interval 5 day) as click_date
            union all
            SELECT date_sub(curdate(), interval 6 day) as click_date) a
            left join
            (
                select date_format(update_time,'%y-%m-%d') as datetime, count(*) as count
                from task where run=0
                group by date_format(update_time,'%y-%m-%d')
            ) b on a.click_date = b.datetime
            order by a.click_date asc
            `
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
            msg: '操作失败'
        })
        return
    }
    return result
}
//统计上周每天完成的数量
async function calculaLatelyMonth(res) {
    let result
    try {
        const sql = `select date_format(a.click_date,'%y-%m-%d') as click_date,ifnull(b.count,0) as count
        from (
            SELECT date_sub(curdate(), interval 7 day) as click_date
            union all
            SELECT date_sub(curdate(), interval 8 day) as click_date
            union all
            SELECT date_sub(curdate(), interval 9 day) as click_date
            union all
            SELECT date_sub(curdate(), interval 10 day) as click_date
            union all
            SELECT date_sub(curdate(), interval 11 day) as click_date
            union all
            SELECT date_sub(curdate(), interval 12 day) as click_date
            union all
            SELECT date_sub(curdate(), interval 13 day) as click_date) a
            left join
            (
                select date_format(update_time,'%y-%m-%d') as datetime, count(*) as count
                from task where run=0
                group by date_format(update_time,'%y-%m-%d')
            ) b on a.click_date = b.datetime
            order by a.click_date asc`
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
            msg: '操作失败'
        })
        return
    }
    return result
}
// 根据id查询用户信息
async function queryUserById(res, id) {
    let result
    try {
        const sql = `select * from user where id='${id}'`
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
            msg: '操作失败'
        })
        return
    }
    return result
}

// 修改密码 
async function updatePassword(res, id, new_password) {
    let result
    try {
        const sql = `update user set password='${new_password}' where id='${id}'`
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
            msg: '操作失败'
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
    queryCategory_Task,
    queryCategoryByName,
    queryLabelByName,
    addCategory,
    addLabel,
    deleteCategoryById,
    deleteLabelById,
    queryCategoryById,
    updateCategoryById,
    updateLabelById,
    queryLabelById,
    queryTask,
    queryTaskCount,
    deleteTaskById,
    queryTaskById,
    updateTaskById,
    unCompleted,
    completed,
    laskweekCompleted,
    laskmonthCompleted,
    calculaLatelyAweek,
    calculaLatelyMonth,
    queryUserById,
    updatePassword
}