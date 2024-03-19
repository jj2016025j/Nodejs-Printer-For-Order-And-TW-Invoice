// qrimage全部都失敗
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
        // .font('a')
        // .align('ct')
        // .size(1, 1)
        // .align('LT')
        .qrimage('https://lee871116.ddns.net', { type: 'png', size: 5 }, function (err) {
            if (err) {
                console.error('打印第一个QR码错误:', err);
                return;
            }
        })
        .size(2, 2) // 设置QR码的大小
        // 定位到左边的位置并打印第一个QR码
        .qrimage('https://example.com/path-to-transaction-details-1', function (err) {
            if (err) {
                console.error('打印第一个QR码错误:', err);
                return;
            }
        })
        // 定位到右边的位置并打印第二个QR码
        .qrimage('https://example.com/path-to-transaction-details-2', function (err) {
            if (err) {
                console.error('打印第二个QR码错误:', err);
                return;
            }
        })
        // .align('RT')
        .qrimage('https://lee871116.ddns.net', function (err) {
            if (err) {
                console.error('打印第二个QR码错误:', err);
                return;
            }
        })
        // .cut()
        .close()
    console.log('打印完成');
});

// 假设一行可以放置40个字符
const lineLength = 25;
const leftText1 = '隨機碼:2016';
const rightText1 = '總計100';

const leftText2 = '賣方:53589318';
const rightText2 = '買方:79461349';

// 计算需要填充的空格数
const fillSpaces = (left, right) => {
    const spaces = lineLength - (left.length + right.length);
    return left + ' '.repeat(spaces) + right;
}