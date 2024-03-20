// 生成訂單編號或桌號 成功 size: 10 大約3公分
const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const qr = require('qr-image');

const device = new escpos.USB();
const options = { encoding: "Big5", width: 42 }
const printer = new escpos.Printer(device, options);

function printOrderWithQR(url, tableNumber, contents) {
    device.open(function (error) {
        if (error) {
            console.error('打印機連接錯誤:', error);
            return;
        }
        console.log('打印機連接成功');

        // 根据订单编号和桌号生成QR码的内容
        const qrContent = `${url}`;

        const qrCode = qr.imageSync(qrContent, { type: 'png', size: 10 });

        printer
            .font('a')
            .align('ct')
            .size(1, 1)
            .text('Fang Food芳鍋')
            .feed(1)
            // .align('lt')
            .size(0, 0)
            .text(`桌號: ${tableNumber}`)
            .text(`訂單編號: ${orderNumber}`)
            .text(`時間: ${formatDateTime(new Date())}`)
            .text('---------------------------')
            .qrimage(qrContent, { type: 'png', size: 10 }, function (err) {
                this.feed()
                this.align('ct')

                // console.log(`桌號: ${tableNumber}`);
                // console.log(`訂單編號: ${orderNumber}`);
                // console.log(`時間: ${formatDateTime(new Date())}`);
                // console.log(`QRCode: ${qrContent}`);

                // contents.forEach(content => {
                //     this.text(content)
                //     console.log(content);
                // })

                this
                    .feed(2)
                    .cut()
                    .close()
            });
        console.log('打印完成');
    });
}

function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const contents = ["本店酌收清潔費10%", "手機掃碼 立即點餐", "Fangs Food 芳鍋", "祝您用餐愉快"]

printOrderWithQR("https://lee871116.ddns.net/A78146133", "12", contents);
