const sharp = require('sharp');
const fs = require('fs');

class ImageProcessor {
  static ensureImageExists(imagePath) {
    if (!fs.existsSync(imagePath)) {
      console.error(`錯誤: 圖片文件 "${imagePath}" 不存在`);
      process.exit(1);
    }
  }

  static async convertToJPEG(imagePath, outputImagePath) {
    try {
        await sharp(imagePath)
          .flatten({ background: { r: 255, g: 255, b: 255 } }) // 移除透明通道，設置白色背景
          .jpeg({ quality: 100 })
          .toFile(outputImagePath);
          
      console.log(`圖片轉換成功: ${outputImagePath}`);
      return outputImagePath;
    } catch (err) {
      console.error('圖片轉換失敗:', err);
      process.exit(1);
    }
  }
}

module.exports = ImageProcessor;
