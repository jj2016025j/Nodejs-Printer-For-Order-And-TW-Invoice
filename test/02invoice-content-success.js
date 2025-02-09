const escpos = require(`escpos`);
escpos.USB = require(`escpos-usb`);
const Jimp = require(`jimp`);
const qr = require(`qr-image`);
const streamToBuffer = require(`stream-to-buffer`);

const device = new escpos.USB();
const options = { encoding: "Big5", width: 42 }
const printer = new escpos.Printer(device, options);

async function printInvoice(invoiceData) {
    // 組合左側二維條碼內容
    const leftQRContent = `${invoiceData.invoiceNumber}:${invoiceData.date}:${invoiceData.randomCode}:${invoiceData.salesAmount}:${invoiceData.totalAmount}:${invoiceData.buyerId}:${invoiceData.sellerId}:${invoiceData.encryptionInfo}`;

    // 組合右側二維條碼內容
    const rightQRContent = `**:${invoiceData.selfUseArea}:${invoiceData.itemCount}:${invoiceData.itemCount}:${invoiceData.encoding}:${invoiceData.products}`;

    device.open(async function (error) {
        if (error) {
            console.error(`打印機連接錯誤:`, error);
            return;
        }
        console.log(`打印機連接成功`);
        // 串接條碼內容
        const barcodeContent = `${invoiceData.invoicePeriod}${invoiceData.invoiceNumber}${invoiceData.randomCode}`;

        printer
            .font(`a`)
            .align(`lt`)
            .size(1, 1)
            .text(invoiceData.header)
            .style(`b`)// 加粗
            .size(1, 1)
            .text(`電子發票證明聯`)
            .size(1, 1)
            .text(` ${convertInvoicePeriod(invoiceData.invoicePeriod)}`)
            .text(` ${invoiceData.invoiceNumber}`)
            .style(`NORMAL`)
            .size(0, 0)
            .text(`     ${invoiceData.dateTime}`)
            .text(fillSpaces(`隨機碼:${invoiceData.randomCode}`, `總計${invoiceData.totalAmount}`, 22))
            .text(fillSpaces(`賣方:${invoiceData.sellerId}`, `買方:${invoiceData.buyerId}`, 22))
            .barcode(barcodeContent, `CODE39`, {
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
                // .cut()
                .font(`a`)
                .align(`lt`)
                .size(0, 0)
                .text(`公司: ${invoiceData.companyInfo}`)
                .style(`NORMAL`)
                .text(`發票編號: ${invoiceData.invoiceNumber}`)
                .text(`開票日期: ${formatInvoiceDate(invoiceData.dateTime)}`)
                .text(`統一編號: ${invoiceData.buyerId}`)
                .text(`地址: ${invoiceData.address}`)
                .text(`電話: ${invoiceData.phone}`)
                .feed(1)
                .text(`商品: `)

            printInvoiceItems(invoiceData.items);

            printer.feed(1)
                .text(`商品總額: ${invoiceData.subTotal}`)
                .text(`加值稅(10%): ${invoiceData.tax}`)
                .text(`總計: ${invoiceData.total}`)
                .feed(2)

            printReturnPolicy(invoiceData.returnPolicyTexts);

            printer
                .feed(2)
                // .cut()
                .close()
        });

        console.log(`打印完成`);
    });
}

const fillSpaces = (left, right, length) => {
    const spaces = length - (left.length + right.length);
    return left + ` `.repeat(spaces) + right;
};

const createQRCode = async (text, size) => {
    const qrStream = qr.image(text, { type: `png`, size: size });
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
    const outputPath = `output.png`;
    await mergedImage.writeAsync(outputPath);
    return outputPath;
};

function convertInvoicePeriod(invoicePeriod) {
    const year = parseInt(invoicePeriod.substring(0, 3));
    const period = parseInt(invoicePeriod.substring(3));

    const startMonth = period - 1;
    const endMonth = startMonth + 1;

    return `${year}年${startMonth.toString().padStart(2, '0')}-${endMonth.toString().padStart(2, '0')}月`;
}

function printReturnPolicy(policyTexts) {
    policyTexts.forEach(text => {
        printer.text(text);
    });
}

// 修改后的格式化并直接打印文本的函数
function printInvoiceItems(items) {
    // 首先打印标题
    printer.text('名稱      數量  單價  總金額');

    // 计算填充长度的函数保持不变
    const calculatePadding = (text, targetWidth) => {
        const chineseCharCount = text.replace(/[\x00-\xff]/g, "").length;
        const otherCharCount = text.length - chineseCharCount;
        const totalLength = chineseCharCount * 2 + otherCharCount;
        return text.padEnd(targetWidth + (text.length - totalLength), ' ');
    };

    // 遍历商品信息并直接打印每项
    items.forEach(item => {
        const name = calculatePadding(item.name, 12);
        const quantity = calculatePadding(item.quantity.toString(), 4);
        const unitPrice = calculatePadding(item.unitPrice.toString(), 8);
        const totalPrice = item.totalPrice.toString();
        printer.text(`${name}${quantity}${unitPrice}${totalPrice}`);
    });
}

function formatInvoiceDate(dateTime) {
    const date = new Date(dateTime);
    // 格式化輸出
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
}

const invoiceData = {
    header: 'FangFood 芳鍋',
    dateTime: '2024-03-18 11:22:33',
    invoicePeriod: '10404',
    invoiceNumber: 'AB-12345678',
    randomCode: '1234',
    totalAmount: '100',
    sellerId: '53589318',
    buyerId: '79461349',
    companyInfo: '芳鍋企業有限公司',
    address: '台北市信義區市府路1號',
    phone: '02-1234-5678',
    items: [
        { name: 'LED顯示器', quantity: 1, unitPrice: 5000, totalPrice: 5000 },
        { name: '無線鍵盤', quantity: 2, unitPrice: 700, totalPrice: 1400 }
    ],
    subTotal: '6400',
    tax: '320',
    total: '6720',
    returnPolicyTexts: [
        '退換貨政策: ',
        '商品購買後30天內可退換，',
        '需保持商品完整包裝。'
    ],
    date: '1100301',
    salesAmount: '00002710', // 未稅銷售額，十六進位
    encryptionInfo: 'encryptedStringHere', // 假設的加密資訊
    selfUseArea: '**********', // 營業人自行使用區
    itemCount: '5',
    encoding: '1', // UTF-8編碼
    products: 'LED顯示器:1:500:無;無線鍵盤:2:750:無',
};

printInvoice(invoiceData);