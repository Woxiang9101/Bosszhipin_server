module.exports = function (server) {
// 得到 IO 对象
    const io = require('socket.io')(server);
// 监视连接 ( 当有一个客户连接上时回调 )
    io.on('connection', function (socket) {
        console.log('有一个soketio连接上了----> ' + socket.id + new Date());

        socket.on('1send', function (data) {
            console.log(' 服务器接收到浏览器的消息', data);
            io.emit('2receive', '用户1 : ' + data);
            console.log(' 服务器向浏览器发送消息', '服务器我收到了，内容为：' + data)

        });

        socket.on('2send', function (data) {
            console.log(' 服务器接收到浏览器的消息', data);
            io.emit('1receive', '用户2 : ' + data);
            console.log(' 服务器向浏览器发送消息', '服务器我收到了，内容为：' + data)
        })

    })
};