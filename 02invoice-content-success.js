const escpos = require('escpos');
escpos.USB = require('escpos-usb');

const device = new escpos.USB();
const options = { encoding: "Big5", width: 42 }
const printer = new escpos.Printer(device, options);

device.open(function (error) {
    if (error) {
        console.error('打印機連接錯誤:', error);
        return;
    }
    console.log('打印機連接成功');

    printer
        .font('a')
        .align('ct')
        .size(1, 1)
        .text('FangFood 芳鍋')
        .style('b')// 加粗
        .size(1, 1)
        .text('電子發票證明聯')
        .size(1, 1)
        .text('103年05-06月')
        .text('AB-11223344')
        .style('NORMAL')
        .size(0, 0)
        .text('2024-03-18 11:22:33')
        .text(fillSpaces(leftText1, rightText1))
        .text(fillSpaces(leftText2, rightText2))
        .barcode('AB-11223344', 'CODE39', {
            width: 1,
            height: 50, // 單位mm
            // position: OFF, // 不顯示條碼值 這條參數有問題
            includeParity: false //EAN13/EAN8 bar code
        })
        .feed(2)
        .cut()
        // .flush() //有點類似執行功能
        .font('a')
        .align('ct')
        .size(1, 1)
        .text('台灣電子科技有限公司')
        .align('lt') // 左对齐
        .style('NORMAL')
        .size(0, 0) // 设置较小的文字大小
        .text('發票編號: AA12345678')
        .text('開票日期: 2024-03-19')
        .text('統一編號: 12345678')
        .text('地址: 台北市信義區市府路1號')
        .text('電話: 02-1234-5678')
        .text('商品: ')
        .text('  LED顯示器 NT.5000 x1 = 5000')
        .text('  無線鍵盤 NT.700 x2 = 1400')
        .text('商品總額: 6400')
        .text('加值稅(5%): 320')
        .text('總計: 6720')
        .align('ct') // 居中对齐
        .text('退換貨政策: 商品購買後30天內可退換，需保持商品完整包裝。')
        .feed(2)
        .cut() // 切纸
        .close()
    console.log('打印完成');
});

const lineLength = 25;
const leftText1 = '隨機碼:2016';
const rightText1 = '總計100';

const leftText2 = '賣方:53589318';
const rightText2 = '買方:79461349';

const fillSpaces = (left, right) => {
    const spaces = lineLength - (left.length + right.length);
    return left + ' '.repeat(spaces) + right;
}