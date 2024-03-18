// 測試net OK
const net = require('net');

const PRINTER_IP = '192.168.1.175';
const PRINTER_PORT = 9100;

const client = new net.Socket();
client.connect(PRINTER_PORT, PRINTER_IP, () => {
    console.log('Connected to printer');
    client.write('Hello, network printer!\n');
    client.end();
});

client.on('data', (data) => {
    console.log('Received:', data.toString());
    client.destroy();
});

client.on('close', () => {
    console.log('Connection closed');
});

client.on('error', (err) => {
    console.error('Connection error:', err);
});
