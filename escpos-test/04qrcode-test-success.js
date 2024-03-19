// 大小成功 內容成功 排版失敗 可以印的 size: 5 大約1.5公分
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

    const qrData1 = 'https://lee871116.ddns.net';
    const qrData2 = 'https://lee871116.ddns.net';

    printer
        .align('LT')
        .qrimage(qrData1, { type: 'png', size: 5 }, function (err) {
            if (err) {
                console.error('打印第一個 QR 碼出错:', err);
                return;
            }

            printer.text('  ');

            printer
                .align('RT')
                .qrimage(qrData2, { type: 'png', size: 5 }, function (err) {
                    if (err) {
                        console.error('打印第二個 QR 碼出错:', err);
                        return;
                    }

                    printer.close();
                });
        });
    console.log('打印完成');
});
