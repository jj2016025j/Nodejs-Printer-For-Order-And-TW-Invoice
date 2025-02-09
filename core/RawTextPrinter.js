const PrinterHandler = require('./PrinterHandler');
const iconv = require('iconv-lite'); // 確保支援不同編碼

class RawTextPrinter extends PrinterHandler {
  /**
   * 列印純文字
   * @param {string} text - 要列印的文字
   * @param {Object} options - 選項
   * @param {string} [options.encoding="ascii"] - 編碼方式 ("ascii", "big5", "utf8")
   * @param {string} [options.align="left"] - 文字對齊方式 ("left", "center", "right")
   * @param {boolean} [options.bold=false] - 是否加粗
   * @param {boolean} [options.underline=false] - 是否加底線
   * @param {boolean} [options.cut=false] - 是否切紙
   */
  printRawText(text, options = {}) {
    const { encoding = "ascii", align = "left", bold = false, underline = false, cut = false } = options;

    this.openDevice((printer) => {
      try {
        const command = this.generateRawCommand(text, encoding, align, bold, underline);

        console.log(`🖨 發送的指令:`, command);
        printer.raw(Buffer.from(command));

        if (cut) printer.cut();
        printer.close();
        console.log('✅ 文字打印完成');
      } catch (error) {
        console.error("❌ 打印錯誤:", error);
      }
    });
  }

  /**
   * 生成 ESC/POS 原始指令
   * @param {string} text - 要列印的文字
   * @param {string} encoding - 字符編碼
   * @param {string} align - 文字對齊方式
   * @param {boolean} bold - 是否加粗
   * @param {boolean} underline - 是否加底線
   * @returns {number[]} ESC/POS 指令
   */
  generateRawCommand(text, encoding, align, bold, underline) {
    const command = [];

    // 初始化命令（ESC @）
    command.push(0x1B, 0x40);

    // 設定對齊方式
    const alignOptions = { left: 0, center: 1, right: 2 };
    command.push(0x1B, 0x61, alignOptions[align] ?? 0);

    // 設定加粗（ESC E n）
    command.push(0x1B, 0x45, bold ? 1 : 0);

    // 設定底線（ESC - n）
    command.push(0x1B, 0x2D, underline ? 1 : 0);

    // 轉換文本編碼
    let encodedText;
    switch (encoding.toLowerCase()) {
      case "big5":
        encodedText = iconv.encode(text, "big5");
        break;
      case "utf8":
        encodedText = iconv.encode(text, "utf8");
        break;
      default:
        encodedText = Buffer.from(text, "ascii");
    }

    // 添加文本
    command.push(...encodedText);

    // 換行
    command.push(0x0A);

    return command;
  }
}

module.exports = RawTextPrinter;
