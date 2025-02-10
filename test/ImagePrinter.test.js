const QRCodePrinter = require('../core/ImagePrinter');

const qrPrinter = new QRCodePrinter();
const singleQRContent = 'https://example.com/single';
const leftQRContent = 'https://example.com/left';
const rightQRContent = 'https://example.com/right';
const customImagePath = 'output.png';
const customImagePath2 = 'src/test.png';

qrPrinter.printQRCode(singleQRContent);
qrPrinter.printDoubleQRCode(leftQRContent, rightQRContent);
qrPrinter.printCustomImage(customImagePath);
qrPrinter.printCustomImage(customImagePath2);