const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const config = require('./PrinterConfig');
const Jimp = require('jimp');

class PrinterHandler {
  constructor() {
    this.device = this.initializeDevice();
    this.printer = new escpos.Printer(this.device, { encoding: config.encoding, width: config.width });
  }

  initializeDevice() {
    switch (config.type) {
      case 'USB':
        return new escpos.USB();
      case 'Network':
        return new escpos.Network(config.networkAddress);
      case 'Serial':
        return new escpos.Serial(config.serialPort);
      default:
        throw new Error('未知的打印設備類型');
    }
  }

  openDevice(callback) {
    this.device.open((error) => {
      if (error) {
        console.error('打印機連接錯誤:', error);
        return;
      }
      console.log('打印機連接成功');
      callback(this.printer);
    });
  }

  closeDevice() {
    this.printer.close();
    console.log('打印機連接已關閉');
  }

  printText(text) {
    this.openDevice((printer) => {
      printer.text(text).feed(2).cut().close();
      console.log('文字列印完成');
    });
  }

  // 載入圖片失敗
  printImage(imagePath, cut = false) {
    this.openDevice((printer) => {
      escpos.Image.load(imagePath, (err, image) => {
        if (err) {
          console.error('載入圖片失敗:', err);
          return;
        }

        printer
          .raster(image)
        if (cut)
          printer.cut();
        printer.close();
        console.log('圖片打印完成');
      });
    });
  }

  async printImage(imagePath) {
    try {
      // 讀取圖片
      const image = await Jimp.read(imagePath);

      // 轉換為 ESC/POS 格式
      const escposImage = await new escpos.Image(image.bitmap);

      this.openDevice((printer) => {
        printer.raster(escposImage).cut().close();
        console.log('圖片打印完成');
      });

    } catch (error) {
      console.error('載入圖片失敗:', error);
    }
  }
}

module.exports = PrinterHandler;
