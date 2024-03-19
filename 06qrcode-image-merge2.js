const Jimp = require('jimp');
const qr = require('qr-image');
const fs = require('fs');
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

// 功能：使用 qr-image 生成二维码图像，并保存到指定路径
function generateQRCode(text, outputPath) {
  return new Promise((resolve, reject) => {
    const qr_png = qr.image(text, { type: 'png' });
    const stream = qr_png.pipe(fs.createWriteStream(outputPath));
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function mergeAndPrintQRCodes(text1, text2) {
  // 生成二维码
  await Promise.all([
    generateQRCode(text1, 'qr1.png'),
    generateQRCode(text2, 'qr2.png')
  ]);

  // 读取和合并二维码图像
  const [image1, image2] = await Promise.all([
    Jimp.read('qr1.png'),
    Jimp.read('qr2.png')
  ]);
  const mergedImage = new Jimp(image1.bitmap.width + image2.bitmap.width, Math.max(image1.bitmap.height, image2.bitmap.height));
  mergedImage.blit(image1, 0, 0);
  mergedImage.blit(image2, image1.bitmap.width, 0);

  // 获取合并后的图像缓冲区并打印
  mergedImage.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
    if (err) throw err;

    const device = new escpos.USB();
    const options = { encoding: "Big5", width: 42 }
    const printer = new escpos.Printer(device, options);

    device.open(function (error) {
      if (error) {
        console.error('打印机连接错误:', error);
        return;
      }

      escpos.Image.load(buffer, function (image) {
        printer.image(image, 's8', function () {
          this.close();
        })
      });
    });
  });
}
const content = 'https://lee871116.ddns.net'

// 调用函数来生成、合并并打印二维码
mergeAndPrintQRCodes(content, content).catch(console.error);
