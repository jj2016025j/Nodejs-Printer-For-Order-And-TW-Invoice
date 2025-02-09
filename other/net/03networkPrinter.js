// 網路接口 需要有打印機才能測試是否成功
const net = require('net');

// 打印机的IP地址和端口
const PRINTER_IP = '192.168.1.175'; // 示例IP，请替换为你的打印机IP
const PRINTER_PORT = 8080; // 默认端口是9100，根据你的打印机可能有所不同

// 创建一个Socket连接到打印机
const client = new net.Socket();
client.connect(PRINTER_PORT, PRINTER_IP, () => {
    console.log('Connected to printer');

    // 构建ESC/POS命令
    const escposCommands = Buffer.from([
        0x1B, 0x40, // 初始化打印机
        ...Buffer.from('Hello, Network Printer!\n'), // 打印文本
        0x1D, 0x56, 0x41, 0x00 // 切纸
    ]);

    // 发送打印命令到打印机
    client.write(escposCommands);

    // 关闭连接
    client.end();
});

client.on('data', (data) => {
    console.log('Received:', data.toString());
    client.destroy(); // 销毁socket实例
});

client.on('close', () => {
    console.log('Connection closed');
});

client.on('error', (err) => {
    console.error('Connection error:', err.message);
});
