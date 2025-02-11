const PrinterHandler = require('./PrinterHandler');

class TextPrinter extends PrinterHandler {
  /**
   * 測試不同功能，可傳入自訂參數
   * @param {Object} options
   */
  printTestSections(options = {}) {
    this.openDevice((printer) => {
      try {
        if (options.text) this.printTextSection(printer, options.text);
        if (options.barcode) this.printBarcodeSection(printer, options.barcode);
        if (options.alignment) this.printAlignmentSection(printer, options.alignment);
        if (options.table) this.printTableSection(printer);

        printer.feed(2);
        if (options.cut) printer.cut();
        printer.close();
        console.log('✅ 測試列印完成');
      } catch (error) {
        console.error("❌ 列印錯誤:", error);
      }
    });
  }

  /**
   * 測試不同字體大小與內容
   * @param {Object} printer
   * @param {Object} options
   * @param {string} options.content - 要列印的文字內容
   * @param {number} options.fontSize - 字體大小 (1~2)
   */
  printTextSection(printer, options = { content: '預設文字', fontSize: 0 }) {
    try {
      printer
        .font('a')
        .align('ct')
        .size(options.fontSize, options.fontSize)
        .text(options.content)
        .feed(1);
    } catch (error) {
      console.error("❌ 文字樣式列印失敗:", error);
    }
  }

  /**
   * 測試不同條碼內容與大小
   * @param {Object} printer
   * @param {Object} options
   * @param {string} options.content - 條碼內容
   * @param {string} options.type - 條碼類型 ('CODE39', 'EAN8', 'EAN13', 'UPC-A')
   * @param {number} options.width - 條碼寬度 (單位 mm)
   * @param {number} options.height - 條碼高度 (單位 mm)
   */
  printBarcodeSection(printer, options = { content: '1234567', type: 'EAN8', width: 10, height: 30 }) {
    try {
      printer
        .align('ct')
        .text(`條碼測試: ${options.content}`)
        .barcode(options.content, options.type, {
          width: options.width,
          height: options.height,
          includeParity: false
        })
        .feed(1);
    } catch (error) {
      console.error("❌ 條碼列印失敗:", error);
    }
  }

  /**
   * 測試不同對齊方式
   * @param {Object} printer
   * @param {Object} options
   * @param {string} options.align - 對齊方式 ('lt', 'ct', 'rt')
   */
  printAlignmentSection(printer, options = { align: 'ct' }) {
    try {
      printer
        .size(0)
        .align(options.align)
        .text(`對齊測試 - ${options.align}`)
        .feed(1);
    } catch (error) {
      console.error("❌ 文字對齊列印失敗:", error);
    }
  }

  /**
   * 列印表格測試 只能給48寬度的打印紙使用
   * @param {Object} printer
   */
  printTableSection(printer) {
    try {
      const tableData = [
        { name: "蘋果", qty: "3", price: "$30" },
        { name: "banana", qty: "5", price: "$50" },
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
    } catch (error) {
      console.error("❌ 表格列印失敗:", error);
    }
  }
}

module.exports = TextPrinter;
