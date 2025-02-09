const PrinterHandler = require('../core/PrinterHandler');
const ImageProcessor = require('../utils/ImageProcessor');

const imagePath = '00test.jpg';
const processedImagePath = 'processed_output.jpg';

// 確保圖片存在
ImageProcessor.ensureImageExists(imagePath);

// 轉換圖片格式並列印
ImageProcessor.convertToJPEG(imagePath, processedImagePath)
  .then((outputPath) => {
    const printer = new PrinterHandler();
    printer.printImage(outputPath);
  });

// 載入圖片失敗