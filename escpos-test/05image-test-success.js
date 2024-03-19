const sharp = require('sharp');

sharp('output.png')
  .toFormat('png')
  .toFile('output_fixed.png')
  .then(() => {
    console.log('图像已成功转换');
    // 然后尝试使用 output_fixed.png
  })
  .catch(err => {
    console.error('转换图像时出错:', err);
  });
