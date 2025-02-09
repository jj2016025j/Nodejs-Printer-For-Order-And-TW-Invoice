const PrinterHandler = require('./PrinterHandler');

class TextPrinter extends PrinterHandler {
  /**
   * 列印範例文本
   */
  printSampleText() {
    this.openDevice((printer, cut = false) => {
      try {
        this.printTextSection(printer);
        this.printBarcodeSection(printer);
        this.printQRCodeSection(printer);
        this.printAlignmentSection(printer);
        this.printTableSection(printer);

        printer.feed(2)
        if (cut) printer.cut();
        printer.close();
        console.log('✅ 文字打印完成');
      } catch (error) {
        console.error("❌ 打印錯誤:", error);
      }
    });
  }

  /**
   * 文字樣式測試
   * @param {Object} printer
   */
  printTextSection(printer) {
    printer
      .font('a') // 設定字體
      .align('ct') // 置中對齊
      .style('bu') // 斜體 + 底線
      .size(1, 1) // 放大 1x1 倍
      .text('The quick brown fox jumps over the lazy dog')
      .text('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG')
      .feed(1)
      .text('嘿! 成功了!') // 中文測試
      .text('你好，這是一個 ESC/POS 印表機測試')
      .feed(1);
  }

  /**
   * 條碼測試
   * @param {Object} printer
   */
  printBarcodeSection(printer) {
    printer
      .align('ct')
      .text('條碼測試')
      .barcode('1234567', 'EAN8')
      .feed(1);
  }

  /**
   * QR 碼測試
   * @param {Object} printer
   */
  printQRCodeSection(printer) {
    printer
      .align('ct')
      .text('QR 碼測試')
      .qrimage('https://example.com', { type: 'png', size: 6 })
      .feed(1);
  }

  /**
   * 文字對齊測試
   * @param {Object} printer
   */
  printAlignmentSection(printer) {
    printer
      .align('lt').text('左對齊 - Left aligned')
      .align('ct').text('中對齊 - Centered text')
      .align('rt').text('右對齊 - Right aligned')
      .feed(1);
  }

  /**
   * 表格測試
   * @param {Object} printer
   */
  printTableSection(printer) {
    const tableData = [
      { name: "蘋果", qty: "3", price: "$30" },
      { name: "香蕉", qty: "5", price: "$50" },
    ];

    printer.align('ct').text('表格測試');

    printer.table(["品項", "數量", "單價"]);

    tableData.forEach(item => {
      printer.tableCustom([
        { text: item.name, align: "LEFT", width: 0.33, style: 'B' },
        { text: item.qty, align: "CENTER", width: 0.33 },
        { text: item.price, align: "RIGHT", width: 0.33 }
      ], { encoding: 'cp857', size: [1, 1] });
    });

    printer.feed(1);
  }
}

module.exports = TextPrinter;
