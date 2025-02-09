const PrinterHandler = require('./PrinterHandler');

class RawTextPrinter extends PrinterHandler {
  printRawText(text) {
    this.openDevice((printer) => {
      const command = [];

      // 文本初始化命令（ESC @）
      command.push(0x1B, 0x40);

      // 將文本轉換為 ASCII 編碼並添加到命令陣列
      for (let i = 0; i < text.length; i++) {
        command.push(text.charCodeAt(i));
      }

      // 打印並換行（LF）
      command.push(0x0A);
      console.log(`發送的指令: ${command}`);

      printer.raw(Buffer.from(command));

      // printer.cut();
      printer.close();
      console.log('文字打印完成');
    });
  }
}

module.exports = RawTextPrinter;
