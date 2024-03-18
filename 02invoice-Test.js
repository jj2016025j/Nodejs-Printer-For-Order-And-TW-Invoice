const escpos = require('escpos');
escpos.USB = require('escpos-usb');

// 選擇USB打印機
const device = new escpos.USB();

// 創建打印機對象
const options = { encoding: "GB18030"}
const printer = new escpos.Printer(device, options);

device.open(function (error) {
    if (error) {
        console.error('打印機連接錯誤:', error);
        return;
    }

    console.log('打印機連接成功');

    // 假设一行可以放置40个字符
    const lineLength = 40;
    const leftText1 = '隨機碼:2016';
    const rightText1 = '總計100';

    const leftText2 = '賣方:53589318';
    const rightText2 = '買方:79461349';

    // 计算需要填充的空格数
    const fillSpaces = (left, right) => {
        const spaces = lineLength - (left.length + right.length);
        return left + ' '.repeat(spaces) + right;
    }

    // 營業人識別標章和標題
    printer
        .font('a')
        .align('ct')
        .size(1, 1)
        .text('FangFood 芳鍋')
        .style('b')
        .size(2, 2) // 设置高度为0.5cm以上
        .text('電子發票證明聯')
        .size(2, 2) // 设置高度为0.5cm以上，并加粗
        .text('103年05-06月')
        .text('AB-11223344')
        .style('NORMAL')
        .size(1, 1) // 设置高度为0.2cm以上
        .text('2024-03-18 11:22:33')
        .text(fillSpaces(leftText1, rightText1))
        .text(fillSpaces(leftText2, rightText2))
        // 打印條碼
        .barcode('AB-11223344', 'CODE39', {
            width: 2,
            height: 50, // 设置高度为0.5cm以上
            displayValue: false // 不显示条码值
        })
        // 打印QR碼，这里需要具体的交易明细数据
        // .pageMode() // 进入页模式
        // .size(2, 2) // 设置QR码的大小
        // // 定位到左边的位置并打印第一个QR码
        // .set('align', 'left')
        // .qrimage('https://example.com/path-to-transaction-details-1', function (err) {
        //     if (err) {
        //         console.error('打印第一个QR码错误:', err);
        //         return;
        //     }
        // })
        // // 定位到右边的位置并打印第二个QR码
        // .set('align', 'right')
        // .qrimage('https://example.com/path-to-transaction-details-2', function (err) {
        //     if (err) {
        //         console.error('打印第二个QR码错误:', err);
        //         return;
        //     }
        // })
        // .cut()
        .close()
        console.log('打印完成');
});