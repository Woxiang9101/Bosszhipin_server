const md5 = require('blueimp-md5');
const mongoose = require('mongoose');

// 1. 连接数据库
// 1.1. 引入 mongoose
// 1.2. 连接指定数据库 (URL 只有数据库是变化的 )
mongoose.connect('mongodb://localhost:27017/gzhipin_test2',
    {useNewUrlParser: true, useUnifiedTopology: true});

// 1.3. 获取连接对象
const conn = mongoose.connection;

// 1.4. 绑定连接完成的监听 ( 用来提示连接成功 )
conn.on('connected', function () {
    console.log(' YE!数据库连接成功!')
});

// 2. 得到对应特定集合的 Model
// 2.1. 字义 Schema( 描述文档结构 )
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型 : dashen/laoban
});

// 2.2.创建一个构造函数，里面描述了是哪个文档以及文档的结构
// 定义 Model( 与集合对应 , 可以操作集合 )
const UserModel = mongoose.model('user', userSchema); // 集合名 : users

// CRUD
// 3.1. 通过 Model 实例的 save() 添加数据
function testSave() {
// user 数据对象
    const user = {
        username: '小明',
        password: md5('1234'),
        type: 'dashen',
    };
    //传入数据
    const userModel = new UserModel(user);
    // 保存到数据库
    userModel.save(function (err, user) {
        console.log('save', err, user)
    })
}

// testSave();


// 3.2. 通过 Model 的 find()/findOne() 查询多个或一个数据
function testFind() {

    UserModel.find(function (err, users) {
        console.log('find() ', err, users)
    });

    UserModel.findOne({username: 'xfzhang'}, function (err, user) {
        console.log('findOne() ', err, user)
    })
}

// testFind();

function testUpdate() {
    UserModel.findByIdAndUpdate({_id: '5ae1241cf2dd541a8c59a981'},
        {username: 'yyy'},
        function (err, user) {
            console.log('findByIdAndUpdate()', err, user)
        })
}

// testUpdate()


// 3.4. 通过 Model 的 remove() 删除匹配的数据
function testDelete() {
    UserModel.remove({_id: '5ae1241cf2dd541a8c59a981'},
        function (err, result) {
            console.log('remove()', err, result)
        })
}

// testDelete()