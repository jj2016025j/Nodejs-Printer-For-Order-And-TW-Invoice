// 找的到usb 但是15行後面的寫法可能跟庫不一樣，好像是驅動或權限不足
const usb = require('usb');

// 通过VID和PID找到打印机，这些值你需要从你的打印机文档或设备管理器中获取
const PRINTER_VID = 3010; // 示例VID，请替换成你的打印机VID
const PRINTER_PID = 44085; // 示例PID，请替换成你的打印机PID

const device = usb.findByIds(PRINTER_VID, PRINTER_PID);

if (!device) {
  console.log('Printer not found!');
  return;
}

try {
  device.open();
  
  // 选择你的打印机接口和终结点
  const interface = device.interfaces[0];
  interface.claim(); // 声明接口
  
  const endpoint = interface.endpoints[0]; // 取决于你的设备，可能需要调整

  // 发送数据到打印机，这里的数据需要根据你的打印机指令集来构造
  const data = Buffer.from('Hello, printer!\n', 'utf-8');
  endpoint.transfer(data, (error) => {
    if (error) {
      console.log('Transfer failed:', error);
    } else {
      console.log('Data sent to printer.');
    }

    // 释放接口并关闭设备
    interface.release(true, (err) => {
      device.close();
    });
  });
} catch (error) {
  console.error('Error:', error);
}
