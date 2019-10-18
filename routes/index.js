const express = require('express');
const router = express.Router();
const md5 = require('blueimp-md5');

const UserModel = require('../db/models').UserModel;



const filter = {password: 0};

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

//注册
router.post('/register', function (req, res) {

    const {username, password, type} = req.body;
    UserModel.findOne({username}, function (err, user) {

        if (user) {
            res.send({code: 1, msg: ' 此用户已存在'})
        } else {
            new UserModel({username, password: md5(password), type})
                .save(function (err, user) {

                    res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7});
                    res.send({code: 0, data: {_id: user._id, username, type}});
                })
        }
    })
});

// 登陆
router.post('/login', function (req, res) {
    const {username, password} = req.body;
    UserModel.findOne({username, password: md5(password)}, filter,
        function (err, user) {
            if (!user) {
                res.send({code: 1, msg: ' 用户名或密码错误'})
            } else {
                console.log('登录成功 ---->' + user);
                res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7});
                res.send({code: 0, data: user}) // user 中没有 pwd
            }
        })
});


// 用户信息完善
router.post('/update', function (req, res) {
    // 得到请求 cookie 的 userid
    const userid = req.cookies.userid;
    if (!userid) {// 如果没有 , 说明没有登陆 , 直接返回提示
        return res.send({code: 1, msg: ' 请先登陆'});
    }

    // 更新数据库中对应的数据
    UserModel.findByIdAndUpdate({_id: userid}, req.body, function (err, user) {

        const {_id, username, type} = user;
        // node 端 ... 不可用
        // const data = {...req.body, _id, username, type}
        // 合并用户信息
        const data = Object.assign(req.body, {_id, username, type});
        // assign(obj1, obj2, obj3,...) // 将多个指定的对象进行合并 , 返回一个合并后的对象
        //返回一个更新后的用户数据
        res.send({code: 0, data})
    })

});

//查询列表
router.post('/list', function (req, res) {
    const {mold} = req.body;
    UserModel.find({type:mold}, filter,function (err, list) {
            if (err) {
                res.send({code: 1, msg: ' 查询失败'})
            } else {
                console.log('列表查询成功 ---->' + list);
                res.send({code: 0, data: list})
            }
        })
});

module.exports = router;
