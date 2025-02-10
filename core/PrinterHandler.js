const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const config = require('../config/PrinterConfig');

class PrinterHandler {
  constructor() {
    this.device = this.initializeDevice();
    this.printer = new escpos.Printer(this.device, { encoding: config.encoding, width: config.width });
  }

  /**
   * 初始化設備
   */
  initializeDevice() {
    switch (config.type) {
      case 'USB':
        return new escpos.USB();
      case 'Network':
        return new escpos.Network(config.networkAddress);
      case 'Serial':
        return new escpos.Serial(config.serialPort);
      default:
        throw new Error(`❌ 未知的打印設備類型: ${config.type}`);
    }
  }

  /**
   * 開啟設備
   * @param {Function} callback
   */
  openDevice(callback) {
    this.device.open((error) => {
      if (error) {
        console.error('❌ 打印機連接錯誤:', error);
        return;
      }
      console.log('✅ 打印機連接成功');
      callback(this.printer);
    });
  }

  /**
   * 關閉設備
   */
  closeDevice() {
    this.printer.close();
    console.log('🔌 打印機連接已關閉');
  }

  /**
   * 列印純文字
   * @param {string} text - 要列印的文字
   */
  printText(text, cut = false) {
    this.openDevice((printer) => {
      printer.text(text);
      printer.feed(2);
      if (cut) printer.cut();
      printer.close();
      console.log('✅ 文字列印完成');
    });
  }
}

module.exports = PrinterHandler;
