const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const Jimp = require('jimp');
const qr = require('qr-image');
const streamToBuffer = require('stream-to-buffer');

const device = new escpos.USB();
const options = { encoding: "Big5", width: 42 }
const printer = new escpos.Printer(device, options);

const fillSpaces = (left, right, length) => {
    const spaces = length - (left.length + right.length);
    return left + ' '.repeat(spaces) + right;
};

const createQRCode = async (text, size) => {
    const qrStream = qr.image(text, { type: 'png', size: size });
    return new Promise((resolve, reject) => {
        streamToBuffer(qrStream, (err, buffer) => {
            if (err) reject(err);
            else Jimp.read(buffer).then(image => resolve(image)).catch(reject);
        });
    });
};

const mergeQRCodes = async (qr1, qr2) => {
    const mergedImage = new Jimp(qr1.bitmap.width + qr2.bitmap.width, Math.max(qr1.bitmap.height, qr2.bitmap.height));
    mergedImage.blit(qr1, 0, 0);
    mergedImage.blit(qr2, qr1.bitmap.width, 0);
    return mergedImage;
};

const printMergedQRCodes = async (url1, url2) => {
    const qr1 = await createQRCode(url1, 5);
    const qr2 = await createQRCode(url2, 5);
    const mergedImage = await mergeQRCodes(qr1, qr2);
    const outputPath = 'output.png';
    await mergedImage.writeAsync(outputPath);
    return outputPath;
};

async function printInvoice(invoiceData) {
    // 組合左側二維條碼內容
    const leftQRContent = `${invoiceData.invoiceNumber}:${invoiceData.date}:${invoiceData.randomCode}:${invoiceData.salesAmount}:${invoiceData.totalAmount}:${invoiceData.buyerId}:${invoiceData.sellerId}:${invoiceData.encryptionInfo}`;

    // 組合右側二維條碼內容
    const rightQRContent = `**:${invoiceData.selfUseArea}:${invoiceData.itemCount}:${invoiceData.itemCount}:${invoiceData.encoding}:${invoiceData.products}`;

    device.open(async function (error) {
        if (error) {
            console.error('打印機連接錯誤:', error);
            return;
        }
        console.log('打印機連接成功');
        // 串接條碼內容
        const barcodeContent = `${invoiceData.invoicePeriod}${invoiceData.invoiceNumber}${invoiceData.randomCode}`;

        printer
            .font('a')
            .align('lt')
            .size(1, 1)
            .text('FangFood 芳鍋')
            .style('b')// 加粗
            .size(1, 1)
            .text('電子發票證明聯')
            .size(1, 1)
            .text(' 103年05-06月')
            .text(' AB-11223344')
            .style('NORMAL')
            .size(0, 0)
            .text('     2024-03-18 11:22:33')
            .text(fillSpaces('隨機碼:2016', '總計100', 22))
            .text(fillSpaces('賣方:53589318', '買方:79461349', 22))
            .barcode(barcodeContent, 'CODE39', {
                width: 1,
                height: 50, // 單位mm
                // position: OFF, // 不顯示條碼值 這條參數有問題
                includeParity: false //EAN13/EAN8 bar code
            })

        const outputPath = await printMergedQRCodes(
            leftQRContent,
            rightQRContent
        ).catch(console.error);

        escpos.Image.load(outputPath, function (image) {
            printer
                .raster(image)
                .cut()
                .font('a')
                .align('lt')
                .size(0, 0)
                .text('公司: 芳鍋企業有限公司')
                .style('NORMAL')
                .text('發票編號: AA12345678')
                .text('開票日期: 2024-03-19')
                .text('統一編號: 12345678')
                .text('地址: 台北市信義區市府路1號')
                .text('電話: 02-1234-5678')
                .feed(1)
                .text('商品: ')
                .text('名稱    數量  單價  總金額')
                .text('LED顯示器  1  5000  5000')
                .text('無線鍵盤  2  700  1400')
                .feed(1)
                .text('商品總額: 6400')
                .text('加值稅(5%): 320')
                .text('總計: 6720')
                .feed(2)
                // .align('ct')
                .text('退換貨政策: ')
                .text('商品購買後30天內可退換，')
                .text('需保持商品完整包裝。')
                .feed(2)
                .cut()
                .close()
        });

        console.log('打印完成');
    });
}

const invoiceData = {
    header: 'FangFood 芳鍋',
    dateTime: '2024-03-18 11:22:33',
    invoicePeriod: '10404',
    invoiceNumber: 'AB12345678',
    totalAmount: '100',
    sellerId: '53589318',
    buyerId: '79461349',
    companyInfo: '芳鍋企業有限公司',
    issueDate: '2024-03-19',
    taxId: '12345678',
    address: '台北市信義區市府路1號',
    phone: '02-1234-5678',
    subTotal: '6400',
    tax: '320',
    total: '6720',
    returnPolicy: '退換貨政策: 商品購買後30天內可退換，需保持商品完整包裝。',
    date: '1100301',
    randomCode: '1234',
    salesAmount: '00002710', // 未稅銷售額，十六進位
    encryptionInfo: 'encryptedStringHere', // 假設的加密資訊
    selfUseArea: '**********', // 營業人自行使用區
    itemCount: '5',
    encoding: '1', // UTF-8編碼
    products: 'LED顯示器:1:500:無;無線鍵盤:2:750:無'
};

printInvoice(invoiceData);