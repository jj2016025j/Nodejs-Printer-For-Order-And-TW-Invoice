const escpos = require('escpos');

class PrintUtils {
    /**
     * 列印圖片
     * @param {Object} device 列印機裝置
     * @param {string} imagePath 圖片路徑
     * @returns {Promise<void>}
     */
    static printImage(device, imagePath) {
        return new Promise((resolve, reject) => {
            escpos.Image.load(imagePath, function (err, image) {
                if (err) return reject(new Error("無法載入圖片: " + err));

                const printer = new escpos.Printer(device);
                printer.raster(image);
                printer.cut();
                printer.close(() => {
                    console.log("圖片打印成功");
                    resolve();
                });
            });
        });
    }
}

module.exports = PrintUtils;
