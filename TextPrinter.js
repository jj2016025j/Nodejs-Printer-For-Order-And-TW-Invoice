const PrinterHandler = require('./PrinterHandler');

class TextPrinter extends PrinterHandler {
  printSampleText() {
    this.openDevice((printer) => {
      printer
        .font('a') // 設置字體
        .align('ct') // 置中對齊
        .style('bu') // 斜體、底線
        .size(1, 1) // 放大 1x1 倍
        .text('The quick brown fox jumps over the lazy dog')
        .text('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG')
        .feed(1)
        .text('嘿!成功了!') // 中文測試
        .text('你好，這是一個 ESC/POS 印表機測試') // 中文句子
        .feed(1)
        
        // 添加條碼測試
        .align('ct')
        .text('條碼測試')
        .barcode('1234567', 'EAN8')
        .feed(1)

        // 添加 QR 碼測試
        .text('QR 碼測試')
        .qrimage('https://example.com', { type: 'png', size: 6 })
        .feed(1)

        // 文字對齊測試
        .align('lt').text('左對齊 - Left aligned')
        .align('ct').text('中對齊 - Centered text')
        .align('rt').text('右對齊 - Right aligned')
        .feed(1)

        // 表格測試
        .align('ct')
        .text('表格測試')
        .table(["品項", "數量", "單價"])
        .tableCustom(
          [
            { text: "蘋果", align: "LEFT", width: 0.33, style: 'B' },
            { text: "3", align: "CENTER", width: 0.33 },
            { text: "$30", align: "RIGHT", width: 0.33 }
          ],
          { encoding: 'cp857', size: [1, 1] }
        )
        .tableCustom(
          [
            { text: "香蕉", align: "LEFT", width: 0.33, style: 'B' },
            { text: "5", align: "CENTER", width: 0.33 },
            { text: "$50", align: "RIGHT", width: 0.33 }
          ],
          { encoding: 'cp857', size: [1, 1] }
        )
        .feed(2)
        
        .cut()
        .close();

      console.log('文字打印完成');
    });
  }
}

module.exports = TextPrinter;
