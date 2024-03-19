// 除了QRcode以外都正常
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