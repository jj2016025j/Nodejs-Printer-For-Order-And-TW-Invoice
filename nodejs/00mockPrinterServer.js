// 架設服務器 OK
const net = require('net');

const PORT = 9100;

const server = net.createServer((socket) => {
    console.log('Client connected');

    // 当接收到客户端数据时触发
    socket.on('data', (data) => {
        console.log(`Received data: ${data}`);
        // 可以在这里模拟打印机响应
        socket.write('Data received\n');
    });

    // 当客户端断开连接时触发
    socket.on('close', () => {
        console.log('Client disconnected');
    });

    // 错误处理
    socket.on('error', (err) => {
        console.error(`Connection error: ${err}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
